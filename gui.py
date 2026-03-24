from __future__ import annotations

import base64
import tkinter as tk
import webbrowser
from datetime import datetime
from pathlib import Path
import time
from tkinter import messagebox, ttk

import cv2
import yaml

import database
from arduino_interface import create_arduino
from camera import Camera
from face_recognition import FaceRecognizer, average_embeddings, compare_embeddings
from tts import create_tts


CONFIG_PATH = Path(__file__).parent / "config.yaml"
AUTHORIZED_FACES_DIR = Path(__file__).parent / "authorized_faces"


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        return {}
    with open(CONFIG_PATH, "r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}


class UltronApp(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("ULTRON School Desktop")
        self.geometry("1520x940")
        self.minsize(1320, 820)

        self.config_data = load_config()
        database.init_db()
        database.bootstrap_staff_accounts(self.config_data)
        AUTHORIZED_FACES_DIR.mkdir(exist_ok=True)

        self.camera = Camera(camera_index=int(self.config_data.get("camera_index", 0)))
        self.face_recognizer = None
        self.tts = create_tts(
            volume=float(self.config_data.get("voice_volume", 1.0)),
            rate=int(self.config_data.get("voice_rate", 150)),
        )
        self.arduino = None
        try:
            self.arduino = create_arduino(self.config_data.get("arduino_port", "COM3"))
            self.arduino.lock_door()
        except Exception:
            self.arduino = None
        self.gate_open_seconds = float(self.config_data.get("gate_open_seconds", 3))
        self.gate_scan_interval_ms = int(self.config_data.get("gate_scan_interval_ms", 900))
        self.gate_event_cooldown_seconds = float(self.config_data.get("gate_event_cooldown_seconds", 6))
        self.gate_monitor_enabled = False
        self.camera_owner = None
        self.last_gate_signature = None
        self.last_gate_signature_at = 0.0

        self.current_user = None
        self.status_var = tk.StringVar(value="Authenticate to continue.")
        self.login_code_var = tk.StringVar()
        self.login_password_var = tk.StringVar()

        self.register_code_var = tk.StringVar()
        self.register_name_var = tk.StringVar()
        self.register_role_var = tk.StringVar(value="student")
        self.register_pin_var = tk.StringVar()
        self.register_email_var = tk.StringVar()
        self.register_phone_var = tk.StringVar()
        self.register_password_var = tk.StringVar()
        self.register_photo_var = tk.StringVar()

        self.finance_state_var = tk.StringVar(value="unpaid")
        self.finance_balance_var = tk.StringVar(value="0")
        self.finance_due_var = tk.StringVar()
        self.finance_days_var = tk.StringVar(value="0")
        self.finance_exempt_var = tk.StringVar()
        self.finance_block_var = tk.BooleanVar(value=False)

        self.invoice_desc_var = tk.StringVar()
        self.invoice_amount_var = tk.StringVar()
        self.invoice_due_var = tk.StringVar()
        self.payment_amount_var = tk.StringVar()
        self.payment_method_var = tk.StringVar(value="cash")
        self.payment_ref_var = tk.StringVar()
        self.admin_pin_var = tk.StringVar()

        self.gate_identity_var = tk.StringVar(value="recognized")
        self.gate_confidence_var = tk.StringVar(value="0.92")
        self.gate_fallback_var = tk.StringVar()

        self.student_login_code_var = tk.StringVar()
        self.student_login_pin_var = tk.StringVar()
        self.student_request_type_var = tk.StringVar(value="payment_notice")
        self.student_request_message_var = tk.StringVar()
        self.request_resolution_note_var = tk.StringVar()
        self.student_portal_user = None
        self.student_photo_image = None
        self.record_photo_image = None

        self._build_shell()
        self.show_login()

    def _build_shell(self) -> None:
        self.columnconfigure(0, weight=1)
        self.rowconfigure(1, weight=1)

        self.header = ttk.Frame(self, padding=(16, 12))
        self.header.grid(row=0, column=0, sticky="ew")
        self.header.columnconfigure(1, weight=1)
        self.header_user_label = ttk.Label(self.header, text="Not signed in")
        self.header_user_label.grid(row=0, column=0, sticky="w")
        ttk.Button(self.header, text="Sign out", command=self.show_login).grid(row=0, column=2, sticky="e")

        self.container = ttk.Frame(self, padding=(16, 0, 16, 0))
        self.container.grid(row=1, column=0, sticky="nsew")
        self.container.columnconfigure(0, weight=1)
        self.container.rowconfigure(0, weight=1)

        self.login_frame = ttk.Frame(self.container, padding=32)
        self.app_frame = ttk.Frame(self.container)

        ttk.Label(self, textvariable=self.status_var, relief="groove", padding=(16, 8), anchor="w").grid(
            row=2, column=0, sticky="ew", padx=16, pady=(8, 16)
        )

        self._build_login_frame()
        self._build_app_frame()

    def _build_login_frame(self) -> None:
        self.login_frame.columnconfigure(0, weight=1)
        card = ttk.LabelFrame(self.login_frame, text="Bursar / Admin Sign In", padding=24)
        card.grid(row=0, column=0, sticky="", padx=260, pady=120)
        card.columnconfigure(1, weight=1)

        ttk.Label(card, text="Staff code").grid(row=0, column=0, sticky="w")
        ttk.Entry(card, textvariable=self.login_code_var, width=24).grid(row=0, column=1, sticky="ew", padx=(12, 0))
        ttk.Label(card, text="Password").grid(row=1, column=0, sticky="w", pady=(12, 0))
        ttk.Entry(card, textvariable=self.login_password_var, show="*", width=24).grid(row=1, column=1, sticky="ew", padx=(12, 0), pady=(12, 0))
        ttk.Button(card, text="Sign in", command=self.sign_in).grid(row=2, column=1, sticky="e", pady=(18, 0))
        ttk.Button(card, text="Forgot password?", command=self.open_contact_admin_dialog).grid(row=3, column=1, sticky="e", pady=(8, 0))

        admin_email = self.config_data.get("admin_contact_email", "admin@school.local")
        admin_phone = self.config_data.get("admin_contact_phone", "+0000000000")
        ttk.Label(
            card,
            text=f"If access is lost, contact admin: {admin_email} or {admin_phone}",
            wraplength=460,
            justify="left",
        ).grid(row=4, column=0, columnspan=2, sticky="w", pady=(18, 0))

    def _build_app_frame(self) -> None:
        self.app_frame.columnconfigure(0, weight=1)
        self.app_frame.rowconfigure(0, weight=1)

        self.notebook = ttk.Notebook(self.app_frame)
        self.notebook.grid(row=0, column=0, sticky="nsew")

        self.directory_tab = ttk.Frame(self.notebook, padding=16)
        self.gate_tab = ttk.Frame(self.notebook, padding=16)
        self.accountant_tab = ttk.Frame(self.notebook, padding=16)
        self.finance_tab = ttk.Frame(self.notebook, padding=16)
        self.student_tab = ttk.Frame(self.notebook, padding=16)
        self.admin_tab = ttk.Frame(self.notebook, padding=16)
        self.logs_tab = ttk.Frame(self.notebook, padding=16)

        self.notebook.add(self.directory_tab, text="Directory")
        self.notebook.add(self.gate_tab, text="Gate Monitor")
        self.notebook.add(self.accountant_tab, text="Accountant")
        self.notebook.add(self.finance_tab, text="Finance")
        self.notebook.add(self.student_tab, text="Student Portal")
        self.notebook.add(self.admin_tab, text="Admin")
        self.notebook.add(self.logs_tab, text="Logs")

        self._build_directory_tab()
        self._build_gate_tab()
        self._build_accountant_tab()
        self._build_finance_tab()
        self._build_student_tab()
        self._build_admin_tab()
        self._build_logs_tab()

    def _build_tree(self, parent, row: int, columns, headings, column: int = 0):
        tree = ttk.Treeview(parent, columns=columns, show="headings")
        for key, title, width in headings:
            tree.heading(key, text=title)
            tree.column(key, width=width, anchor="w")
        tree.grid(row=row, column=column, sticky="nsew")
        parent.rowconfigure(row, weight=1)
        parent.columnconfigure(column, weight=1)
        return tree

    def _build_directory_tab(self) -> None:
        self.directory_tab.columnconfigure(0, weight=1)
        ttk.Label(self.directory_tab, text="School Directory", font=("Segoe UI", 16, "bold")).grid(row=0, column=0, columnspan=3, sticky="w")
        form = ttk.LabelFrame(self.directory_tab, text="Create User", padding=16)
        form.grid(row=1, column=0, sticky="ew", pady=(12, 12))
        for col in range(6):
            form.columnconfigure(col, weight=1 if col % 2 else 0)
        entries = [
            ("Code", self.register_code_var),
            ("Full name", self.register_name_var),
            ("Email", self.register_email_var),
            ("Phone", self.register_phone_var),
            ("PIN", self.register_pin_var),
            ("Staff password", self.register_password_var),
            ("Photo path", self.register_photo_var),
        ]
        for idx, (label, var) in enumerate(entries):
            ttk.Label(form, text=label).grid(row=idx // 2, column=(idx % 2) * 2, sticky="w", pady=(0 if idx < 2 else 8, 0))
            ttk.Entry(form, textvariable=var, show="*" if label in {"PIN", "Staff password"} else "").grid(row=idx // 2, column=(idx % 2) * 2 + 1, sticky="ew", padx=(8, 16), pady=(0 if idx < 2 else 8, 0))
        ttk.Label(form, text="Role").grid(row=4, column=0, sticky="w", pady=(8, 0))
        ttk.Combobox(form, textvariable=self.register_role_var, values=[row["name"] for row in database.list_roles()], state="readonly").grid(row=4, column=1, sticky="ew", padx=(8, 16), pady=(8, 0))
        ttk.Button(form, text="Create profile", command=self.create_user_from_form).grid(row=4, column=5, sticky="e", pady=(8, 0))
        ttk.Button(form, text="Capture student face", command=self.capture_selected_student_face).grid(row=4, column=4, sticky="e", pady=(8, 0), padx=(0, 8))

        self.directory_tree = self._build_tree(
            self.directory_tab,
            2,
            ("code", "name", "role", "email", "authorized"),
            (("code", "Code", 120), ("name", "Name", 240), ("role", "Role", 120), ("email", "Email", 220), ("authorized", "Gate Access", 120)),
        )

    def _build_gate_tab(self) -> None:
        self.gate_tab.columnconfigure(0, weight=3)
        self.gate_tab.columnconfigure(1, weight=2)
        ttk.Label(self.gate_tab, text="Gate Decision Monitor", font=("Segoe UI", 16, "bold")).grid(row=0, column=0, columnspan=2, sticky="w")
        self.gate_summary = ttk.Label(self.gate_tab, text="")
        self.gate_summary.grid(row=1, column=0, columnspan=2, sticky="w", pady=(6, 12))
        self.gate_live_status_label = ttk.Label(
            self.gate_tab,
            text="Gate monitor is idle.",
            relief="ridge",
            padding=(12, 8),
            anchor="w",
        )
        self.gate_live_status_label.grid(row=2, column=0, columnspan=2, sticky="ew", pady=(0, 12))
        self.gate_student_tree = self._build_tree(
            self.gate_tab,
            3,
            ("code", "name", "state", "balance", "blocked"),
            (("code", "Code", 120), ("name", "Student", 220), ("state", "Fee State", 120), ("balance", "Balance", 100), ("blocked", "Blocked", 90)),
            column=0,
        )
        panel = ttk.LabelFrame(self.gate_tab, text="Decision Simulation", padding=16)
        panel.grid(row=3, column=1, sticky="nsew", padx=(12, 0))
        panel.columnconfigure(1, weight=1)
        ttk.Label(panel, text="Identity status").grid(row=0, column=0, sticky="w")
        ttk.Combobox(panel, textvariable=self.gate_identity_var, values=["recognized", "low_confidence", "unknown"], state="readonly").grid(row=0, column=1, sticky="ew", padx=(8, 0))
        ttk.Label(panel, text="Confidence").grid(row=1, column=0, sticky="w", pady=(8, 0))
        ttk.Entry(panel, textvariable=self.gate_confidence_var).grid(row=1, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Label(panel, text="Fallback student code").grid(row=2, column=0, sticky="w", pady=(8, 0))
        ttk.Entry(panel, textvariable=self.gate_fallback_var).grid(row=2, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Button(panel, text="Run gate decision", command=self.run_gate_decision).grid(row=3, column=1, sticky="e", pady=(14, 0))
        ttk.Button(panel, text="Start gate monitor", command=self.start_gate_monitor).grid(row=3, column=0, sticky="w", pady=(14, 0))
        ttk.Button(panel, text="Stop gate monitor", command=self.stop_gate_monitor).grid(row=4, column=0, sticky="w", pady=(8, 0))
        ttk.Button(panel, text="Single scan", command=self.scan_gate_from_camera).grid(row=4, column=1, sticky="e", pady=(8, 0))
        ttk.Label(
            panel,
            text="Recognized + debt -> notify bursar. Recognized + denied -> urgent bursar alert. Unknown or low-confidence -> no bursar alert until identity is confirmed.",
            wraplength=360,
            justify="left",
        ).grid(row=5, column=0, columnspan=2, sticky="w", pady=(16, 0))
        self.notification_tree = self._build_tree(
            panel,
            6,
            ("student", "type", "status"),
            (("student", "Student", 130), ("type", "Type", 140), ("status", "Status", 90)),
        )
        ttk.Button(panel, text="Resolve notification", command=self.resolve_selected_notification).grid(row=7, column=1, sticky="e", pady=(12, 0))

    def _build_accountant_tab(self) -> None:
        self.accountant_tab.columnconfigure(0, weight=3)
        self.accountant_tab.columnconfigure(1, weight=2)
        self.accountant_tab.rowconfigure(2, weight=1)
        ttk.Label(self.accountant_tab, text="Bursar Controls", font=("Segoe UI", 16, "bold")).grid(row=0, column=0, columnspan=2, sticky="w")
        self.student_tree = self._build_tree(
            self.accountant_tab,
            1,
            ("code", "name", "state", "balance", "due", "days", "blocked"),
            (("code", "Code", 110), ("name", "Student", 200), ("state", "State", 100), ("balance", "Balance", 100), ("due", "Due", 110), ("days", "Grace Days", 100), ("blocked", "Blocked", 90)),
            column=0,
        )
        self.student_tree.bind("<<TreeviewSelect>>", lambda _e: self.load_selected_student_finance())
        form = ttk.LabelFrame(self.accountant_tab, text="Student Finance Policy", padding=16)
        form.grid(row=1, column=1, sticky="nsew", padx=(12, 0))
        form.columnconfigure(1, weight=1)
        ttk.Label(form, text="Payment state").grid(row=0, column=0, sticky="w")
        ttk.Combobox(form, textvariable=self.finance_state_var, values=["full", "partial", "unpaid"], state="readonly").grid(row=0, column=1, sticky="ew", padx=(8, 0))
        ttk.Label(form, text="Balance due").grid(row=1, column=0, sticky="w", pady=(8, 0))
        ttk.Entry(form, textvariable=self.finance_balance_var).grid(row=1, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Label(form, text="Due date").grid(row=2, column=0, sticky="w", pady=(8, 0))
        ttk.Entry(form, textvariable=self.finance_due_var).grid(row=2, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Label(form, text="Allowed entry days").grid(row=3, column=0, sticky="w", pady=(8, 0))
        ttk.Entry(form, textvariable=self.finance_days_var).grid(row=3, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Label(form, text="No-verify until").grid(row=4, column=0, sticky="w", pady=(8, 0))
        ttk.Entry(form, textvariable=self.finance_exempt_var).grid(row=4, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Checkbutton(form, text="Block gate access", variable=self.finance_block_var).grid(row=5, column=0, columnspan=2, sticky="w", pady=(12, 0))
        ttk.Button(form, text="Apply bursar decision", command=self.apply_finance_update).grid(row=6, column=1, sticky="e", pady=(16, 0))

        detail = ttk.LabelFrame(self.accountant_tab, text="Selected Student Record", padding=16)
        detail.grid(row=2, column=0, columnspan=2, sticky="nsew", pady=(12, 0))
        detail.columnconfigure(1, weight=1)
        detail.rowconfigure(0, weight=1)
        self.record_photo_label = ttk.Label(detail, text="No photo", width=28, anchor="center", relief="ridge")
        self.record_photo_label.grid(row=0, column=0, sticky="nsw")
        self.record_info_label = ttk.Label(detail, text="Select a student to view profile details.", justify="left", anchor="nw")
        self.record_info_label.grid(row=0, column=1, sticky="nsew", padx=(16, 0))

        requests_box = ttk.LabelFrame(self.accountant_tab, text="Student Requests", padding=16)
        requests_box.grid(row=3, column=0, columnspan=2, sticky="nsew", pady=(12, 0))
        requests_box.columnconfigure(0, weight=1)
        self.accountant_tab.rowconfigure(3, weight=1)
        self.student_requests_admin_tree = self._build_tree(
            requests_box,
            0,
            ("student", "type", "status", "created", "message"),
            (("student", "Student", 130), ("type", "Type", 150), ("status", "Status", 90), ("created", "Created", 170), ("message", "Message", 420)),
        )
        resolve_row = ttk.Frame(requests_box)
        resolve_row.grid(row=1, column=0, sticky="ew", pady=(12, 0))
        resolve_row.columnconfigure(1, weight=1)
        ttk.Label(resolve_row, text="Resolution note").grid(row=0, column=0, sticky="w")
        ttk.Entry(resolve_row, textvariable=self.request_resolution_note_var).grid(row=0, column=1, sticky="ew", padx=(8, 12))
        ttk.Button(resolve_row, text="Resolve request", command=self.resolve_selected_student_request).grid(row=0, column=2, sticky="e")

    def _build_finance_tab(self) -> None:
        self.finance_tab.columnconfigure(0, weight=3)
        self.finance_tab.columnconfigure(1, weight=2)
        ttk.Label(self.finance_tab, text="School Finance", font=("Segoe UI", 16, "bold")).grid(row=0, column=0, columnspan=2, sticky="w")
        left = ttk.Frame(self.finance_tab)
        left.grid(row=1, column=0, sticky="nsew")
        left.columnconfigure(0, weight=1)
        invoice_form = ttk.LabelFrame(left, text="Invoice", padding=16)
        invoice_form.grid(row=0, column=0, sticky="ew")
        invoice_form.columnconfigure(1, weight=1)
        ttk.Label(invoice_form, text="Description").grid(row=0, column=0, sticky="w")
        ttk.Entry(invoice_form, textvariable=self.invoice_desc_var).grid(row=0, column=1, sticky="ew", padx=(8, 0))
        ttk.Label(invoice_form, text="Amount").grid(row=1, column=0, sticky="w", pady=(8, 0))
        ttk.Entry(invoice_form, textvariable=self.invoice_amount_var).grid(row=1, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Label(invoice_form, text="Due date").grid(row=2, column=0, sticky="w", pady=(8, 0))
        ttk.Entry(invoice_form, textvariable=self.invoice_due_var).grid(row=2, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Button(invoice_form, text="Create invoice", command=self.create_invoice_for_selected).grid(row=3, column=1, sticky="e", pady=(12, 0))
        self.invoice_tree = self._build_tree(left, 1, ("desc", "balance", "status", "due"), (("desc", "Description", 220), ("balance", "Balance", 100), ("status", "Status", 100), ("due", "Due", 110)))
        payment_form = ttk.LabelFrame(left, text="Payment", padding=16)
        payment_form.grid(row=2, column=0, sticky="ew", pady=(12, 0))
        payment_form.columnconfigure(1, weight=1)
        ttk.Label(payment_form, text="Amount").grid(row=0, column=0, sticky="w")
        ttk.Entry(payment_form, textvariable=self.payment_amount_var).grid(row=0, column=1, sticky="ew", padx=(8, 0))
        ttk.Label(payment_form, text="Method").grid(row=1, column=0, sticky="w", pady=(8, 0))
        ttk.Combobox(payment_form, textvariable=self.payment_method_var, values=sorted(database.PAYMENT_METHODS), state="readonly").grid(row=1, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Label(payment_form, text="Reference").grid(row=2, column=0, sticky="w", pady=(8, 0))
        ttk.Entry(payment_form, textvariable=self.payment_ref_var).grid(row=2, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Button(payment_form, text="Record payment", command=self.record_payment_for_selected).grid(row=3, column=1, sticky="e", pady=(12, 0))
        self.payment_tree = self._build_tree(left, 3, ("amount", "method", "date", "ref"), (("amount", "Amount", 100), ("method", "Method", 120), ("date", "Date", 170), ("ref", "Reference", 140)))
        right = ttk.LabelFrame(self.finance_tab, text="Summary", padding=16)
        right.grid(row=1, column=1, sticky="nsew", padx=(12, 0))
        right.columnconfigure(0, weight=1)
        self.finance_summary = ttk.Label(right, text="")
        self.finance_summary.grid(row=0, column=0, sticky="w")

    def _build_student_tab(self) -> None:
        self.student_tab.columnconfigure(0, weight=2)
        self.student_tab.columnconfigure(1, weight=3)
        self.student_tab.rowconfigure(1, weight=1)

        login_box = ttk.LabelFrame(self.student_tab, text="Student Sign In", padding=16)
        login_box.grid(row=0, column=0, sticky="ew", padx=(0, 12))
        login_box.columnconfigure(1, weight=1)
        ttk.Label(login_box, text="Student code").grid(row=0, column=0, sticky="w")
        ttk.Entry(login_box, textvariable=self.student_login_code_var).grid(row=0, column=1, sticky="ew", padx=(8, 0))
        ttk.Label(login_box, text="PIN").grid(row=1, column=0, sticky="w", pady=(8, 0))
        ttk.Entry(login_box, textvariable=self.student_login_pin_var, show="*").grid(row=1, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Button(login_box, text="Open portal", command=self.student_sign_in).grid(row=2, column=1, sticky="e", pady=(12, 0))
        ttk.Button(login_box, text="Lock portal", command=self.lock_student_portal).grid(row=2, column=0, sticky="w", pady=(12, 0))
        ttk.Label(
            login_box,
            text="Student records are only shown after successful PIN authentication using the PIN issued at registration.",
            wraplength=420,
            justify="left",
        ).grid(row=3, column=0, columnspan=2, sticky="w", pady=(12, 0))

        self.student_profile_box = ttk.LabelFrame(self.student_tab, text="Student Profile", padding=16)
        self.student_profile_box.grid(row=1, column=0, sticky="nsew", padx=(0, 12))
        self.student_profile_box.columnconfigure(1, weight=1)
        self.student_photo_label = ttk.Label(self.student_profile_box, text="No photo", width=24, anchor="center", relief="ridge")
        self.student_photo_label.grid(row=0, column=0, sticky="nsw")
        self.student_info_label = ttk.Label(self.student_profile_box, text="Sign in to view student information.", justify="left", anchor="nw")
        self.student_info_label.grid(row=0, column=1, sticky="nsew", padx=(16, 0))

        right = ttk.Frame(self.student_tab)
        right.grid(row=0, column=1, rowspan=2, sticky="nsew")
        right.columnconfigure(0, weight=1)
        right.rowconfigure(1, weight=1)
        right.rowconfigure(3, weight=1)

        request_box = ttk.LabelFrame(right, text="Student Requests", padding=16)
        request_box.grid(row=0, column=0, sticky="ew")
        request_box.columnconfigure(1, weight=1)
        ttk.Label(request_box, text="Type").grid(row=0, column=0, sticky="w")
        ttk.Combobox(
            request_box,
            textvariable=self.student_request_type_var,
            values=["payment_notice", "payment_delay_reason", "info_change_request"],
            state="readonly",
        ).grid(row=0, column=1, sticky="ew", padx=(8, 0))
        ttk.Label(request_box, text="Message").grid(row=1, column=0, sticky="nw", pady=(8, 0))
        ttk.Entry(request_box, textvariable=self.student_request_message_var).grid(row=1, column=1, sticky="ew", padx=(8, 0), pady=(8, 0))
        ttk.Button(request_box, text="Send to bursar", command=self.student_send_request).grid(row=2, column=1, sticky="e", pady=(12, 0))

        self.student_receipts_tree = self._build_tree(
            right,
            1,
            ("amount", "method", "date", "ref"),
            (("amount", "Amount", 100), ("method", "Method", 120), ("date", "Date", 170), ("ref", "Reference", 140)),
        )
        self.student_requests_tree = self._build_tree(
            right,
            3,
            ("type", "status", "created", "message"),
            (("type", "Type", 150), ("status", "Status", 100), ("created", "Created", 170), ("message", "Message", 380)),
        )

    def _build_admin_tab(self) -> None:
        self.admin_tab.columnconfigure(0, weight=3)
        self.admin_tab.columnconfigure(1, weight=2)
        ttk.Label(self.admin_tab, text="Admin Controls", font=("Segoe UI", 16, "bold")).grid(row=0, column=0, columnspan=2, sticky="w")
        self.user_tree = self._build_tree(
            self.admin_tab,
            1,
            ("code", "name", "role", "authorized"),
            (("code", "Code", 120), ("name", "Name", 220), ("role", "Role", 120), ("authorized", "Access", 100)),
            column=0,
        )
        box = ttk.LabelFrame(self.admin_tab, text="Admin Actions", padding=16)
        box.grid(row=1, column=1, sticky="nsew", padx=(12, 0))
        box.columnconfigure(0, weight=1)
        ttk.Button(box, text="Authorize selected", command=lambda: self.set_selected_access(True)).grid(row=0, column=0, sticky="ew")
        ttk.Button(box, text="Deny selected", command=lambda: self.set_selected_access(False)).grid(row=1, column=0, sticky="ew", pady=(8, 0))
        ttk.Label(box, text="Reset PIN").grid(row=2, column=0, sticky="w", pady=(16, 0))
        ttk.Entry(box, textvariable=self.admin_pin_var, show="*").grid(row=3, column=0, sticky="ew", pady=(8, 0))
        ttk.Button(box, text="Apply PIN", command=self.reset_selected_pin).grid(row=4, column=0, sticky="ew", pady=(8, 0))

    def _build_logs_tab(self) -> None:
        self.logs_tab.columnconfigure(0, weight=1)
        self.log_tree = self._build_tree(
            self.logs_tab,
            0,
            ("time", "actor", "event", "outcome", "subject", "details"),
            (("time", "Timestamp", 170), ("actor", "Actor", 120), ("event", "Event", 160), ("outcome", "Outcome", 100), ("subject", "Subject", 120), ("details", "Details", 620)),
        )

    def show_login(self) -> None:
        self.current_user = None
        self.stop_gate_monitor(reason="Gate monitor stopped.")
        self.lock_student_portal()
        self.header_user_label.config(text="Not signed in")
        self.app_frame.grid_forget()
        self.login_frame.grid(row=0, column=0, sticky="nsew")
        self.status_var.set("Authenticate to continue.")

    def sign_in(self) -> None:
        user = database.authenticate_staff(self.login_code_var.get(), self.login_password_var.get())
        if user is None:
            self.status_var.set("Authentication failed.")
            messagebox.showerror("Sign in failed", "Invalid staff code or password.", parent=self)
            return
        self.current_user = user
        self.header_user_label.config(text=f"Signed in as {user['full_name']} ({user['role_name']})")
        self.login_password_var.set("")
        self.login_frame.grid_forget()
        self.app_frame.grid(row=0, column=0, sticky="nsew")
        self.notebook.select(self.gate_tab)
        self.refresh_all_views()
        self.status_var.set("Authenticated.")
        self.start_gate_monitor()

    def actor_code(self) -> str:
        return self.current_user["user_code"] if self.current_user else database.SYSTEM_ACTOR

    def lock_student_portal(self) -> None:
        self.student_portal_user = None
        self.student_login_pin_var.set("")
        self.student_photo_image = None
        if hasattr(self, "student_receipts_tree"):
            self.student_receipts_tree.delete(*self.student_receipts_tree.get_children())
        if hasattr(self, "student_requests_tree"):
            self.student_requests_tree.delete(*self.student_requests_tree.get_children())
        if hasattr(self, "student_photo_label"):
            self.student_photo_label.configure(text="No photo", image="")
        if hasattr(self, "student_info_label"):
            self.student_info_label.configure(text="Sign in with the registration PIN to view this student record.")

    def _load_photo_image(self, photo_path: str | None, width: int = 180, height: int = 180):
        if not photo_path:
            return None
        image_path = Path(photo_path)
        if not image_path.exists():
            return None
        image = cv2.imread(str(image_path))
        if image is None:
            return None
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (width, height), interpolation=cv2.INTER_AREA)
        success, encoded = cv2.imencode(".png", cv2.cvtColor(image, cv2.COLOR_RGB2BGR))
        if not success:
            return None
        return tk.PhotoImage(data=base64.b64encode(encoded.tobytes()).decode("ascii"))

    def _ensure_face_recognizer(self) -> FaceRecognizer:
        if self.face_recognizer is None:
            self.face_recognizer = FaceRecognizer()
        return self.face_recognizer

    def _acquire_camera(self, owner: str) -> bool:
        if self.camera_owner and self.camera_owner != owner:
            return False
        if not self.camera.is_opened():
            if not self.camera.start():
                return False
        self.camera_owner = owner
        return True

    def _release_camera(self, owner: str) -> None:
        if self.camera_owner == owner:
            self.camera.release()
            self.camera_owner = None

    def _open_gate(self) -> None:
        if self.arduino:
            self.arduino.unlock_door()
            self.after(int(self.gate_open_seconds * 1000), self._lock_gate)

    def _lock_gate(self) -> None:
        if self.arduino:
            self.arduino.lock_door()

    def _speak_gate_message(self, result: dict) -> None:
        decision = str(result.get("decision") or "")
        if decision in {"recognized_allowed", "granted_with_fee_alert"}:
            self.tts.speak_async("Access granted")
        elif decision == "denied_with_bursar_alert":
            self.tts.speak_async("Access denied")
        elif decision == "manual_review":
            self.tts.speak_async("Please enter your pin")
        elif decision == "unknown_face":
            self.tts.speak_async("Face not recognized")
        else:
            self.tts.speak_async("Access denied")

    def _capture_face_samples(self, user_code: str, sample_count: int = 5) -> tuple[np.ndarray | None, str | None]:
        recognizer = self._ensure_face_recognizer()
        if not self._acquire_camera("registration"):
            raise RuntimeError("Unable to start the camera.")
        embeddings = []
        saved_photo = None
        try:
            while len(embeddings) < sample_count:
                frame = self.camera.capture_frame()
                if frame is None:
                    continue
                embedding, bbox = recognizer.get_embedding_from_frame(frame)
                display = frame.copy()
                if bbox:
                    x, y, w, h = bbox
                    cv2.rectangle(display, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(
                    display,
                    f"Capture varied angles/light {len(embeddings)}/{sample_count} - press C to save, Q to cancel",
                    (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 0),
                    1,
                )
                cv2.imshow("ULTRON Student Registration", display)
                key = cv2.waitKey(1) & 0xFF
                if key == ord("q"):
                    return None, None
                if key == ord("c") and embedding is not None:
                    embeddings.append(embedding)
                    if saved_photo is None and bbox:
                        x, y, w, h = bbox
                        face_crop = frame[max(0, y): y + h, max(0, x): x + w]
                        photo_path = AUTHORIZED_FACES_DIR / f"{user_code}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                        cv2.imwrite(str(photo_path), face_crop if face_crop.size else frame)
                        saved_photo = str(photo_path)
        finally:
            cv2.destroyAllWindows()
            self._release_camera("registration")
        return average_embeddings(embeddings), saved_photo

    def _recognize_from_frame(self, frame) -> tuple[str, str | None, float]:
        recognizer = self._ensure_face_recognizer()
        embedding, _bbox = recognizer.get_embedding_from_frame(frame)
        if embedding is None:
            return "unknown", None, 0.0
        best_code = None
        best_similarity = 0.0
        for record in database.list_student_face_records():
            similarity = compare_embeddings(embedding, record["embedding"])
            if similarity > best_similarity:
                best_similarity = similarity
                best_code = record["user_code"]
        match_threshold = float(self.config_data.get("face_match_threshold", 0.48))
        low_threshold = max(0.30, match_threshold - 0.08)
        if best_code and best_similarity >= match_threshold:
            return "recognized", best_code, best_similarity
        if best_code and best_similarity >= low_threshold:
            return "low_confidence", best_code, best_similarity
        return "unknown", None, best_similarity

    def open_contact_admin_dialog(self) -> None:
        email = self.config_data.get("admin_contact_email", "admin@school.local")
        phone = self.config_data.get("admin_contact_phone", "+0000000000")
        dialog = tk.Toplevel(self)
        dialog.title("Contact Admin")
        dialog.transient(self)
        dialog.grab_set()
        box = ttk.Frame(dialog, padding=20)
        box.grid(row=0, column=0, sticky="nsew")
        ttk.Label(box, text="Contact the admin to reset your bursar password.", wraplength=420, justify="left").grid(row=0, column=0, columnspan=2, sticky="w")
        ttk.Label(box, text=f"Email: {email}").grid(row=1, column=0, columnspan=2, sticky="w", pady=(12, 0))
        ttk.Label(box, text=f"Phone: {phone}").grid(row=2, column=0, columnspan=2, sticky="w", pady=(8, 0))
        ttk.Button(box, text="Open email client", command=lambda: webbrowser.open(f"mailto:{email}?subject=ULTRON%20Password%20Reset")).grid(row=3, column=0, sticky="ew", pady=(16, 0))
        ttk.Button(box, text="Show call number", command=lambda: messagebox.showinfo("Admin phone", phone, parent=dialog)).grid(row=3, column=1, sticky="ew", padx=(8, 0), pady=(16, 0))

    def create_user_from_form(self) -> None:
        if self.current_user and self.current_user["role_name"] == "accountant":
            self.register_role_var.set("student")
        if self.current_user and self.current_user["role_name"] == "accountant" and self.register_role_var.get() != "student":
            messagebox.showwarning("Role restricted", "The bursar can register students only.", parent=self)
            return
        try:
            database.create_user(
                user_code=self.register_code_var.get(),
                full_name=self.register_name_var.get(),
                role_name=self.register_role_var.get(),
                pin=self.register_pin_var.get() or None,
                email=self.register_email_var.get() or None,
                phone=self.register_phone_var.get() or None,
                password=self.register_password_var.get() or None,
                photo_path=self.register_photo_var.get() or None,
                actor_code=self.actor_code(),
            )
        except Exception as exc:
            self._error("Create profile failed", exc)
            return
        for var in (
            self.register_code_var,
            self.register_name_var,
            self.register_pin_var,
            self.register_email_var,
            self.register_phone_var,
            self.register_password_var,
            self.register_photo_var,
        ):
            var.set("")
        self.status_var.set("Profile created.")
        self.refresh_all_views()

    def capture_selected_student_face(self) -> None:
        selected = self.student_tree.selection()
        if not selected:
            messagebox.showwarning("No selection", "Select a student in the bursar list first.", parent=self)
            return
        record = database.get_student_record(int(selected[0]))
        if record is None:
            messagebox.showwarning("Missing record", "Student record not found.", parent=self)
            return
        should_resume_gate = self.gate_monitor_enabled
        if should_resume_gate:
            self.stop_gate_monitor(reason="Gate monitor paused for student registration.")
        try:
            embedding, photo_path = self._capture_face_samples(record["user_code"])
            if embedding is None:
                self.status_var.set("Student face capture cancelled.")
                return
            database.set_user_face_encoding(int(record["id"]), embedding, actor_code=self.actor_code())
            if photo_path:
                database.set_user_photo(int(record["id"]), photo_path, actor_code=self.actor_code())
        except Exception as exc:
            self._error("Face capture failed", exc)
            return
        finally:
            if should_resume_gate and self.current_user is not None:
                self.start_gate_monitor()
        self.status_var.set("Student face captured and enrolled.")
        self.refresh_all_views()

    def run_gate_decision(self) -> None:
        selected = self.gate_student_tree.selection()
        selected_code = self.gate_student_tree.item(selected[0], "values")[0] if selected else None
        try:
            result = self._handle_gate_result(
                self.gate_identity_var.get(),
                selected_code,
                float(self.gate_confidence_var.get() or 0),
            )
        except Exception as exc:
            self._error("Gate decision failed", exc)
            return
        self.status_var.set(str(result["message"]))
        self.refresh_all_views()

    def scan_gate_from_camera(self) -> None:
        if not self._acquire_camera("manual_gate_scan"):
            self._error("Gate scan failed", RuntimeError("Unable to start the camera."))
            return
        frame = None
        try:
            while True:
                frame = self.camera.capture_frame()
                if frame is None:
                    continue
                display = frame.copy()
                cv2.putText(
                    display,
                    "Press S to scan gate, Q to cancel",
                    (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 255, 0),
                    2,
                )
                cv2.imshow("ULTRON Gate Camera", display)
                key = cv2.waitKey(1) & 0xFF
                if key == ord("q"):
                    self.status_var.set("Gate scan cancelled.")
                    return
                if key == ord("s"):
                    break
        finally:
            cv2.destroyAllWindows()
            self._release_camera("manual_gate_scan")
        try:
            identity_status, matched_code, confidence = self._recognize_from_frame(frame)
            result = self._handle_gate_result(identity_status, matched_code, confidence)
        except Exception as exc:
            self._error("Gate scan failed", exc)
            return
        self.status_var.set(str(result["message"]))
        self.refresh_all_views()

    def _handle_gate_result(self, identity_status: str, matched_code: str | None, confidence: float):
        result = database.evaluate_gate_access(
            identity_status=identity_status,
            user_code=matched_code,
            confidence=confidence,
            fallback_user_code=self.gate_fallback_var.get() or None,
            actor_code=self.actor_code(),
        )
        self.gate_identity_var.set(identity_status)
        self.gate_confidence_var.set(f"{confidence:.2f}")
        if result.get("granted"):
            self._open_gate()
        else:
            self._lock_gate()
        self._speak_gate_message(result)
        return result

    def start_gate_monitor(self) -> None:
        if self.gate_monitor_enabled:
            return
        self.gate_monitor_enabled = True
        self.notebook.select(self.gate_tab)
        self.gate_live_status_label.config(text="Gate monitor starting...")
        self._gate_monitor_tick()

    def stop_gate_monitor(self, reason: str = "Gate monitor stopped.") -> None:
        self.gate_monitor_enabled = False
        self._release_camera("gate_monitor")
        self._lock_gate()
        self.gate_live_status_label.config(text=reason)

    def _gate_monitor_tick(self) -> None:
        if not self.gate_monitor_enabled:
            return
        if not self._acquire_camera("gate_monitor"):
            self.gate_live_status_label.config(text="Gate monitor waiting for camera access...")
            self.after(self.gate_scan_interval_ms, self._gate_monitor_tick)
            return
        frame = self.camera.capture_frame()
        if frame is None:
            self.gate_live_status_label.config(text="Gate monitor active. Waiting for camera frames...")
            self.after(self.gate_scan_interval_ms, self._gate_monitor_tick)
            return
        identity_status, matched_code, confidence = self._recognize_from_frame(frame)
        signature = (identity_status, matched_code)
        now = time.monotonic()
        should_process = True
        if signature == self.last_gate_signature and (now - self.last_gate_signature_at) < self.gate_event_cooldown_seconds:
            should_process = False
        if should_process:
            result = self._handle_gate_result(identity_status, matched_code, confidence)
            self.last_gate_signature = signature
            self.last_gate_signature_at = now
            self.gate_live_status_label.config(text=str(result["message"]))
            self.status_var.set(str(result["message"]))
            self.refresh_gate()
        else:
            label = matched_code or identity_status.replace("_", " ")
            self.gate_live_status_label.config(text=f"Gate monitor active. Watching {label} at confidence {confidence:.2f}.")
        self.after(self.gate_scan_interval_ms, self._gate_monitor_tick)

    def resolve_selected_notification(self) -> None:
        selected = self.notification_tree.selection()
        if not selected:
            messagebox.showwarning("No selection", "Select a notification first.", parent=self)
            return
        database.resolve_notification(int(selected[0]), actor_code=self.actor_code())
        self.status_var.set("Notification resolved.")
        self.refresh_all_views()

    def resolve_selected_student_request(self) -> None:
        selected = self.student_requests_admin_tree.selection()
        if not selected:
            messagebox.showwarning("No selection", "Select a student request first.", parent=self)
            return
        try:
            database.resolve_student_request(
                int(selected[0]),
                resolution_note=self.request_resolution_note_var.get() or None,
                actor_code=self.actor_code(),
            )
        except Exception as exc:
            self._error("Request resolution failed", exc)
            return
        self.request_resolution_note_var.set("")
        self.status_var.set("Student request resolved.")
        self.refresh_all_views()

    def _selected_student_id(self) -> int | None:
        if self.student_tree.selection():
            return int(self.student_tree.selection()[0])
        if self.gate_student_tree.selection():
            return int(self.gate_student_tree.selection()[0])
        return None

    def load_selected_student_finance(self) -> None:
        selected = self.student_tree.selection()
        if not selected:
            return
        row = database.get_student_finance_profile(int(selected[0]))
        record = database.get_student_record(int(selected[0]))
        if row is None:
            return
        self.finance_state_var.set(row["payment_state"])
        self.finance_balance_var.set(str(row["balance_due"]))
        self.finance_due_var.set(row["due_date"] or "")
        self.finance_days_var.set(str(row["allowed_entry_days"] or 0))
        self.finance_exempt_var.set(row["verification_exempt_until"] or "")
        self.finance_block_var.set(bool(row["block_access"]))
        self._show_record_profile(record)
        self.refresh_finance_tables(int(selected[0]))

    def _show_record_profile(self, record) -> None:
        if record is None:
            self.record_photo_image = None
            self.record_photo_label.configure(text="No photo", image="")
            self.record_info_label.configure(text="Select a student to view profile details.")
            return
        self.record_photo_image = self._load_photo_image(record["photo_path"])
        if self.record_photo_image:
            self.record_photo_label.configure(image=self.record_photo_image, text="")
        else:
            self.record_photo_label.configure(image="", text="No photo")
        self.record_info_label.configure(
            text=(
                f"Name: {record['full_name']}\n"
                f"Code: {record['user_code']}\n"
                f"Email: {record['email'] or '-'}\n"
                f"Phone: {record['phone'] or '-'}\n"
                f"Payment state: {record['payment_state']}\n"
                f"Balance due: {record['balance_due']}\n"
                f"Due date: {record['due_date'] or '-'}\n"
                f"Allowed entry days: {record['allowed_entry_days']}\n"
                f"Gate blocked: {'yes' if record['block_access'] else 'no'}\n"
                f"No-verify until: {record['verification_exempt_until'] or '-'}"
            )
        )

    def student_sign_in(self) -> None:
        student = database.authenticate_student(self.student_login_code_var.get(), self.student_login_pin_var.get())
        if student is None:
            self.lock_student_portal()
            messagebox.showerror("Student sign in failed", "Invalid student code or PIN.", parent=self)
            self.status_var.set("Student sign in failed.")
            return
        self.student_portal_user = student
        self.student_login_pin_var.set("")
        self.refresh_student_portal()
        self.status_var.set(f"Student portal opened for {student['full_name']}.")

    def student_send_request(self) -> None:
        if self.student_portal_user is None:
            messagebox.showwarning("Student sign in required", "Sign in to the student portal first.", parent=self)
            return
        try:
            database.create_student_request(
                user_id=int(self.student_portal_user["id"]),
                request_type=self.student_request_type_var.get(),
                message=self.student_request_message_var.get(),
                actor_code=self.student_portal_user["user_code"],
            )
        except Exception as exc:
            self._error("Student request failed", exc)
            return
        self.student_request_message_var.set("")
        self.refresh_student_portal()
        self.refresh_gate()
        self.status_var.set("Student request sent to bursar.")

    def apply_finance_update(self) -> None:
        user_id = self._selected_student_id()
        if user_id is None:
            messagebox.showwarning("No selection", "Select a student first.", parent=self)
            return
        try:
            database.set_student_finance_status(
                user_id=user_id,
                payment_state=self.finance_state_var.get(),
                balance_due=float(self.finance_balance_var.get() or 0),
                due_date=self.finance_due_var.get() or None,
                allowed_entry_days=int(self.finance_days_var.get() or 0),
                block_access=self.finance_block_var.get(),
                verification_exempt_until=self.finance_exempt_var.get() or None,
                actor_code=self.actor_code(),
            )
        except Exception as exc:
            self._error("Bursar update failed", exc)
            return
        self.status_var.set("Student finance policy updated.")
        self.refresh_all_views()

    def create_invoice_for_selected(self) -> None:
        user_id = self._selected_student_id()
        if user_id is None:
            messagebox.showwarning("No selection", "Select a student first.", parent=self)
            return
        try:
            database.create_invoice(user_id, self.invoice_desc_var.get(), float(self.invoice_amount_var.get()), self.invoice_due_var.get() or None, self.actor_code())
        except Exception as exc:
            self._error("Invoice creation failed", exc)
            return
        self.invoice_desc_var.set("")
        self.invoice_amount_var.set("")
        self.invoice_due_var.set("")
        self.status_var.set("Invoice created.")
        self.refresh_all_views()

    def record_payment_for_selected(self) -> None:
        user_id = self._selected_student_id()
        if user_id is None:
            messagebox.showwarning("No selection", "Select a student first.", parent=self)
            return
        try:
            database.record_payment(
                user_id=user_id,
                amount=float(self.payment_amount_var.get()),
                method=self.payment_method_var.get(),
                actor_code=self.actor_code(),
                reference=self.payment_ref_var.get() or None,
            )
        except Exception as exc:
            self._error("Payment failed", exc)
            return
        self.payment_amount_var.set("")
        self.payment_ref_var.set("")
        self.status_var.set("Payment recorded.")
        self.refresh_all_views()

    def set_selected_access(self, authorized: bool) -> None:
        if not self.current_user or self.current_user["role_name"] != "admin":
            messagebox.showwarning("Admin only", "Only an admin can override access here.", parent=self)
            return
        selected = self.user_tree.selection()
        if not selected:
            messagebox.showwarning("No selection", "Select a user first.", parent=self)
            return
        try:
            database.set_user_access(int(selected[0]), authorized, actor_code=self.actor_code(), reason="Admin desktop override.", override=True)
        except Exception as exc:
            self._error("Access update failed", exc)
            return
        self.status_var.set("Access updated.")
        self.refresh_all_views()

    def reset_selected_pin(self) -> None:
        if not self.current_user or self.current_user["role_name"] != "admin":
            messagebox.showwarning("Admin only", "Only an admin can reset PINs here.", parent=self)
            return
        selected = self.user_tree.selection()
        if not selected:
            messagebox.showwarning("No selection", "Select a user first.", parent=self)
            return
        try:
            database.reset_pin(int(selected[0]), self.admin_pin_var.get(), actor_code=self.actor_code())
        except Exception as exc:
            self._error("PIN reset failed", exc)
            return
        self.admin_pin_var.set("")
        self.status_var.set("PIN reset.")
        self.refresh_all_views()

    def refresh_all_views(self) -> None:
        self.refresh_directory()
        self.refresh_gate()
        self.refresh_students()
        self.refresh_student_requests_admin()
        self.refresh_finance_summary()
        self.refresh_users()
        self.refresh_logs()
        self.refresh_student_portal()

    def refresh_directory(self) -> None:
        self.directory_tree.delete(*self.directory_tree.get_children())
        for row in database.list_users():
            self.directory_tree.insert("", "end", iid=str(row["id"]), values=(row["user_code"], row["full_name"], row["role_name"], row["email"] or "", "yes" if row["is_authorized"] else "no"))
        if self.current_user and self.current_user["role_name"] == "accountant":
            self.register_role_var.set("student")

    def refresh_gate(self) -> None:
        summary = database.get_dashboard_summary()
        self.gate_summary.config(text=f"Students: {summary['students']}   Outstanding: {summary['outstanding_students']}   Blocked: {summary['blocked_students']}   Open notifications: {summary['open_notifications']}")
        self.gate_student_tree.delete(*self.gate_student_tree.get_children())
        for row in database.list_students():
            self.gate_student_tree.insert("", "end", iid=str(row["id"]), values=(row["user_code"], row["full_name"], row["payment_state"], row["balance_due"], "yes" if row["block_access"] else "no"))
        self.notification_tree.delete(*self.notification_tree.get_children())
        for row in database.list_notifications(limit=50):
            self.notification_tree.insert("", "end", iid=str(row["id"]), values=(row["user_code"], row["notification_type"], row["status"]))

    def refresh_students(self) -> None:
        self.student_tree.delete(*self.student_tree.get_children())
        for row in database.list_students():
            self.student_tree.insert("", "end", iid=str(row["id"]), values=(row["user_code"], row["full_name"], row["payment_state"], row["balance_due"], row["due_date"] or "-", row["allowed_entry_days"], "yes" if row["block_access"] else "no"))
        selected = self._selected_student_id()
        if selected is not None:
            self.refresh_finance_tables(selected)
            self._show_record_profile(database.get_student_record(selected))
        else:
            self._show_record_profile(None)

    def refresh_finance_tables(self, user_id: int) -> None:
        self.invoice_tree.delete(*self.invoice_tree.get_children())
        for row in database.list_invoices(user_id):
            self.invoice_tree.insert("", "end", iid=str(row["id"]), values=(row["description"], row["balance_amount"], row["status"], row["due_date"] or "-"))
        self.payment_tree.delete(*self.payment_tree.get_children())
        for row in database.list_payments(user_id):
            self.payment_tree.insert("", "end", iid=str(row["id"]), values=(row["amount"], row["method"], row["payment_date"], row["reference"] or ""))

    def refresh_finance_summary(self) -> None:
        summary = database.get_dashboard_summary()
        self.finance_summary.config(text=f"Outstanding balance: {summary['outstanding_balance']}\nOutstanding students: {summary['outstanding_students']}\nBlocked students: {summary['blocked_students']}\nOpen notifications: {summary['open_notifications']}")

    def refresh_student_requests_admin(self) -> None:
        self.student_requests_admin_tree.delete(*self.student_requests_admin_tree.get_children())
        for row in database.list_student_requests(limit=200):
            self.student_requests_admin_tree.insert(
                "",
                "end",
                iid=str(row["id"]),
                values=(row["user_code"], row["request_type"], row["status"], row["created_at"], row["message"]),
            )

    def refresh_users(self) -> None:
        self.user_tree.delete(*self.user_tree.get_children())
        for row in database.list_users():
            self.user_tree.insert("", "end", iid=str(row["id"]), values=(row["user_code"], row["full_name"], row["role_name"], "yes" if row["is_authorized"] else "no"))

    def refresh_logs(self) -> None:
        self.log_tree.delete(*self.log_tree.get_children())
        for row in database.list_logs():
            self.log_tree.insert("", "end", values=(row["created_at"], row["actor_code"] or row["actor_label"], row["event_type"], row["outcome"], row["subject_code"] or "", row["details"] or ""))

    def refresh_student_portal(self) -> None:
        self.student_receipts_tree.delete(*self.student_receipts_tree.get_children())
        self.student_requests_tree.delete(*self.student_requests_tree.get_children())
        if self.student_portal_user is None:
            self.student_photo_image = None
            self.student_photo_label.configure(text="No photo", image="")
            self.student_info_label.configure(text="Sign in with the registration PIN to view this student record.")
            return
        record = database.get_student_record(int(self.student_portal_user["id"]))
        if record is None:
            self.student_portal_user = None
            self.student_info_label.configure(text="Student record not found.")
            self.student_photo_label.configure(text="No photo", image="")
            return
        self.student_portal_user = record
        self.student_photo_image = self._load_photo_image(record["photo_path"])
        if self.student_photo_image:
            self.student_photo_label.configure(image=self.student_photo_image, text="")
        else:
            self.student_photo_label.configure(image="", text="No photo")
        self.student_info_label.configure(
            text=(
                f"Name: {record['full_name']}\n"
                f"Code: {record['user_code']}\n"
                f"Email: {record['email'] or '-'}\n"
                f"Phone: {record['phone'] or '-'}\n"
                f"Payment state: {record['payment_state']}\n"
                f"Balance due: {record['balance_due']}\n"
                f"Due date: {record['due_date'] or '-'}\n"
                f"Gate access: {'allowed' if record['is_authorized'] else 'blocked'}\n"
                f"Allowed entry days: {record['allowed_entry_days']}\n"
                f"No-verify until: {record['verification_exempt_until'] or '-'}"
            )
        )
        for row in database.list_student_receipts(int(record["id"])):
            self.student_receipts_tree.insert("", "end", iid=str(row["id"]), values=(row["amount"], row["method"], row["payment_date"], row["reference"] or ""))
        for row in database.list_student_requests(user_id=int(record["id"]), limit=100):
            self.student_requests_tree.insert("", "end", iid=str(row["id"]), values=(row["request_type"], row["status"], row["created_at"], row["message"]))

    def _error(self, title: str, exc: Exception) -> None:
        messagebox.showerror(title, str(exc), parent=self)
        self.status_var.set(f"{title}: {exc}")
