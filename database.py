from __future__ import annotations

import hashlib
import os
import secrets
import sqlite3
import sys
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from typing import Iterator

import numpy as np

DB_PATH = Path(__file__).parent / "ultron.db"
SYSTEM_ACTOR = "system"
ROLE_DEFINITIONS = (
    ("student", "Student tracked at the gate and in school finance records."),
    ("teacher", "Teacher profile."),
    ("accountant", "Bursar or school accountant."),
    ("admin", "Administrative operator with full control."),
)
FEE_STATES = {"full", "partial", "unpaid"}
PAYMENT_METHODS = {"cash", "card", "bank", "mobile_money", "other"}
STAFF_ROLES = {"accountant", "admin"}
GATE_DECISION_TYPES = {"recognized", "low_confidence", "unknown"}


def utc_now() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat()


def normalize_optional_date(value: str | None) -> str | None:
    if not value:
        return None
    return datetime.fromisoformat(value).date().isoformat()


@contextmanager
def get_connection() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def _table_has_column(conn: sqlite3.Connection, table: str, column: str) -> bool:
    rows = conn.execute(f"PRAGMA table_info({table})").fetchall()
    return any(row["name"] == column for row in rows)


def _ensure_column(conn: sqlite3.Connection, table: str, column: str, definition: str) -> None:
    if not _table_has_column(conn, table, column):
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                description TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_code TEXT NOT NULL UNIQUE,
                full_name TEXT NOT NULL,
                role_id INTEGER NOT NULL,
                face_encoding BLOB,
                face_image_dir TEXT,
                is_active INTEGER NOT NULL DEFAULT 1,
                is_authorized INTEGER NOT NULL DEFAULT 1,
                access_revoked INTEGER NOT NULL DEFAULT 0,
                override_authorized INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (role_id) REFERENCES roles(id)
            );
            CREATE TABLE IF NOT EXISTS fee_status (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL UNIQUE,
                payment_state TEXT NOT NULL DEFAULT 'unpaid',
                due_date TEXT,
                last_payment_at TEXT,
                updated_by INTEGER,
                updated_at TEXT NOT NULL,
                notes TEXT,
                balance_due REAL NOT NULL DEFAULT 0,
                allowed_entry_days INTEGER NOT NULL DEFAULT 0,
                block_access INTEGER NOT NULL DEFAULT 0,
                verification_exempt_until TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
            );
            CREATE TABLE IF NOT EXISTS access_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                actor_user_id INTEGER,
                actor_label TEXT NOT NULL,
                subject_user_id INTEGER,
                event_type TEXT NOT NULL,
                outcome TEXT NOT NULL,
                details TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (subject_user_id) REFERENCES users(id) ON DELETE SET NULL
            );
            CREATE TABLE IF NOT EXISTS pin_store (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL UNIQUE,
                pin_hash TEXT NOT NULL,
                pin_salt TEXT NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1,
                issued_at TEXT NOT NULL,
                revoked_at TEXT,
                updated_by INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
            );
            CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                description TEXT NOT NULL,
                total_amount REAL NOT NULL,
                balance_amount REAL NOT NULL,
                due_date TEXT,
                status TEXT NOT NULL DEFAULT 'open',
                created_by INTEGER,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
            );
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                invoice_id INTEGER,
                amount REAL NOT NULL,
                payment_date TEXT NOT NULL,
                method TEXT NOT NULL,
                reference TEXT,
                notes TEXT,
                recorded_by INTEGER,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
                FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
            );
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                notification_type TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'open',
                message TEXT NOT NULL,
                created_at TEXT NOT NULL,
                resolved_at TEXT,
                resolved_by INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
            );
            CREATE TABLE IF NOT EXISTS student_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                request_type TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'open',
                created_at TEXT NOT NULL,
                resolved_at TEXT,
                resolved_by INTEGER,
                resolution_note TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
            );
            """
        )
        conn.executemany("INSERT OR IGNORE INTO roles (name, description) VALUES (?, ?)", ROLE_DEFINITIONS)
        for column, definition in (
            ("balance_due", "REAL NOT NULL DEFAULT 0"),
            ("allowed_entry_days", "INTEGER NOT NULL DEFAULT 0"),
            ("block_access", "INTEGER NOT NULL DEFAULT 0"),
            ("verification_exempt_until", "TEXT"),
        ):
            _ensure_column(conn, "fee_status", column, definition)
        for column, definition in (
            ("email", "TEXT"),
            ("phone", "TEXT"),
            ("password_hash", "TEXT"),
            ("password_salt", "TEXT"),
            ("photo_path", "TEXT"),
            ("force_password_change", "INTEGER NOT NULL DEFAULT 0"),
        ):
            _ensure_column(conn, "users", column, definition)
    refresh_access_states()


def get_role_id(role_name: str) -> int:
    with get_connection() as conn:
        row = conn.execute("SELECT id FROM roles WHERE name = ?", (role_name.lower(),)).fetchone()
    if row is None:
        raise ValueError(f"Unknown role: {role_name}")
    return int(row["id"])


def _get_role_id(conn: sqlite3.Connection, role_name: str) -> int:
    row = conn.execute("SELECT id FROM roles WHERE name = ?", (role_name.lower(),)).fetchone()
    if row is None:
        raise ValueError(f"Unknown role: {role_name}")
    return int(row["id"])


def get_user_by_code(user_code: str) -> sqlite3.Row | None:
    with get_connection() as conn:
        return conn.execute(
            "SELECT users.*, roles.name AS role_name FROM users JOIN roles ON roles.id = users.role_id WHERE users.user_code = ?",
            (user_code,),
        ).fetchone()


def get_user_by_id(user_id: int) -> sqlite3.Row | None:
    with get_connection() as conn:
        return conn.execute(
            "SELECT users.*, roles.name AS role_name FROM users JOIN roles ON roles.id = users.role_id WHERE users.id = ?",
            (user_id,),
        ).fetchone()


def get_user_by_email(email: str) -> sqlite3.Row | None:
    with get_connection() as conn:
        return conn.execute(
            "SELECT users.*, roles.name AS role_name FROM users JOIN roles ON roles.id = users.role_id WHERE lower(users.email) = lower(?)",
            (email,),
        ).fetchone()


def resolve_actor(actor_code: str | None) -> dict[str, int | str | None]:
    if not actor_code or actor_code.strip().lower() == SYSTEM_ACTOR:
        return {"actor_user_id": None, "actor_label": SYSTEM_ACTOR}
    actor = get_user_by_code(actor_code.strip())
    if actor is None:
        return {"actor_user_id": None, "actor_label": actor_code.strip()}
    return {"actor_user_id": int(actor["id"]), "actor_label": actor["user_code"]}


def list_roles() -> list[sqlite3.Row]:
    with get_connection() as conn:
        return list(conn.execute("SELECT * FROM roles ORDER BY id").fetchall())


def serialize_face_encoding(embedding: np.ndarray | None) -> bytes | None:
    if embedding is None:
        return None
    return np.asarray(embedding, dtype=np.float32).tobytes()


def deserialize_face_encoding(blob: bytes | None) -> np.ndarray | None:
    if not blob:
        return None
    return np.frombuffer(blob, dtype=np.float32)


def _insert_log_event(
    conn: sqlite3.Connection,
    event_type: str,
    outcome: str,
    actor_code: str = SYSTEM_ACTOR,
    actor_user_id: int | None = None,
    subject_user_id: int | None = None,
    details: str | None = None,
    created_at: str | None = None,
) -> None:
    conn.execute(
        "INSERT INTO access_logs (actor_user_id, actor_label, subject_user_id, event_type, outcome, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (actor_user_id, actor_code, subject_user_id, event_type, outcome, details, created_at or utc_now()),
    )


def log_event(
    event_type: str,
    outcome: str,
    actor_code: str = SYSTEM_ACTOR,
    actor_user_id: int | None = None,
    subject_user_id: int | None = None,
    details: str | None = None,
) -> None:
    with get_connection() as conn:
        _insert_log_event(conn, event_type, outcome, actor_code, actor_user_id, subject_user_id, details)


def create_user(
    user_code: str,
    full_name: str,
    role_name: str,
    pin: str | None = None,
    email: str | None = None,
    phone: str | None = None,
    password: str | None = None,
    photo_path: str | None = None,
    actor_code: str | None = None,
) -> int:
    user_code = user_code.strip()
    full_name = full_name.strip()
    role_name = role_name.strip().lower()
    if not user_code or not full_name:
        raise ValueError("User code and full name are required.")
    if role_name not in {entry[0] for entry in ROLE_DEFINITIONS}:
        raise ValueError(f"Unsupported role: {role_name}")
    if role_name == "student" and not (pin or "").strip():
        raise ValueError("Student registration requires a PIN.")

    actor = resolve_actor(actor_code)
    now = utc_now()
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO users (
                user_code, full_name, role_id, is_active, is_authorized,
                access_revoked, override_authorized, created_at, updated_at, email, phone, photo_path
            ) VALUES (?, ?, ?, 1, 1, 0, 0, ?, ?, ?, ?, ?)
            """,
            (user_code, full_name, _get_role_id(conn, role_name), now, now, email, phone, photo_path),
        )
        user_id = int(cursor.lastrowid)
        if role_name == "student":
            _set_student_finance_status(
                conn,
                user_id=user_id,
                payment_state="unpaid",
                balance_due=0.0,
                due_date=None,
                allowed_entry_days=0,
                block_access=False,
                verification_exempt_until=None,
                actor_user_id=actor["actor_user_id"],
                notes="Initial student finance profile.",
            )
        if pin:
            _upsert_pin(conn, user_id, pin, actor["actor_user_id"], active=True)
        if password:
            _set_user_password(conn, user_id, password, force_password_change=False)
        _insert_log_event(
            conn,
            event_type="user_created",
            outcome="success",
            actor_code=actor["actor_label"],
            actor_user_id=actor["actor_user_id"],
            subject_user_id=user_id,
            details=f"Created {role_name} profile for {full_name} ({user_code}).",
            created_at=now,
        )
    return user_id


def list_users(role_name: str | None = None) -> list[sqlite3.Row]:
    refresh_access_states()
    query = "SELECT users.*, roles.name AS role_name FROM users JOIN roles ON roles.id = users.role_id"
    params: tuple[object, ...] = ()
    if role_name:
        query += " WHERE roles.name = ?"
        params = (role_name.lower(),)
    query += " ORDER BY users.full_name COLLATE NOCASE"
    with get_connection() as conn:
        return list(conn.execute(query, params).fetchall())


def _set_user_password(
    conn: sqlite3.Connection,
    user_id: int,
    password: str,
    force_password_change: bool = False,
) -> None:
    password = password.strip()
    if len(password) < 6:
        raise ValueError("Password must be at least 6 characters long.")
    salt = os.urandom(16)
    password_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120000).hex()
    conn.execute(
        "UPDATE users SET password_hash = ?, password_salt = ?, force_password_change = ?, updated_at = ? WHERE id = ?",
        (password_hash, salt.hex(), int(force_password_change), utc_now(), user_id),
    )


def set_user_password(user_id: int, password: str, actor_code: str | None = None, force_password_change: bool = False) -> None:
    actor = resolve_actor(actor_code)
    with get_connection() as conn:
        _set_user_password(conn, user_id, password, force_password_change=force_password_change)
    log_event(
        event_type="staff_password_updated",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details="Staff password updated.",
    )


def set_user_contact(user_id: int, email: str | None, phone: str | None, actor_code: str | None = None) -> None:
    actor = resolve_actor(actor_code)
    with get_connection() as conn:
        conn.execute(
            "UPDATE users SET email = ?, phone = ?, updated_at = ? WHERE id = ?",
            ((email or "").strip() or None, (phone or "").strip() or None, utc_now(), user_id),
        )
    log_event(
        event_type="user_contact_updated",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details="User contact details updated.",
    )


def set_user_photo(user_id: int, photo_path: str | None, actor_code: str | None = None) -> None:
    actor = resolve_actor(actor_code)
    with get_connection() as conn:
        conn.execute(
            "UPDATE users SET photo_path = ?, updated_at = ? WHERE id = ?",
            ((photo_path or "").strip() or None, utc_now(), user_id),
        )
    log_event(
        event_type="user_photo_updated",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details="User photo path updated.",
    )


def set_user_face_encoding(user_id: int, embedding: np.ndarray | None, actor_code: str | None = None) -> None:
    actor = resolve_actor(actor_code)
    with get_connection() as conn:
        conn.execute(
            "UPDATE users SET face_encoding = ?, updated_at = ? WHERE id = ?",
            (serialize_face_encoding(embedding), utc_now(), user_id),
        )
    log_event(
        event_type="user_face_updated",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details="User face encoding updated.",
    )


def list_student_face_records() -> list[dict[str, object]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT users.id, users.user_code, users.full_name, users.face_encoding, users.photo_path
            FROM users
            JOIN roles ON roles.id = users.role_id
            WHERE roles.name = 'student' AND users.face_encoding IS NOT NULL
            ORDER BY users.full_name COLLATE NOCASE
            """
        ).fetchall()
    return [
        {
            "id": int(row["id"]),
            "user_code": row["user_code"],
            "full_name": row["full_name"],
            "embedding": deserialize_face_encoding(row["face_encoding"]),
            "photo_path": row["photo_path"],
        }
        for row in rows
    ]


def authenticate_staff(user_code: str, password: str) -> sqlite3.Row | None:
    user = get_user_by_code(user_code.strip())
    if user is None or user["role_name"] not in STAFF_ROLES or not user["is_active"]:
        return None
    if not user["password_hash"] or not user["password_salt"]:
        return None
    computed = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(user["password_salt"]),
        120000,
    ).hex()
    return user if computed == user["password_hash"] else None


def authenticate_student(user_code: str, pin: str) -> sqlite3.Row | None:
    user = get_user_by_code(user_code.strip())
    if user is None or user["role_name"] != "student" or not user["is_active"]:
        return None
    return user if verify_pin(user_code.strip(), pin.strip()) else None


def ensure_staff_account(
    user_code: str,
    full_name: str,
    role_name: str,
    password: str,
    email: str | None = None,
    phone: str | None = None,
    force_password_change: bool = False,
) -> int:
    existing = get_user_by_code(user_code)
    if existing is not None:
        if email != existing["email"] or phone != existing["phone"]:
            set_user_contact(int(existing["id"]), email, phone, actor_code=SYSTEM_ACTOR)
        if not existing["password_hash"]:
            set_user_password(
                int(existing["id"]),
                password,
                actor_code=SYSTEM_ACTOR,
                force_password_change=force_password_change,
            )
        return int(existing["id"])
    user_id = create_user(
        user_code=user_code,
        full_name=full_name,
        role_name=role_name,
        email=email,
        phone=phone,
        password=password,
        actor_code=SYSTEM_ACTOR,
    )
    if force_password_change:
        set_user_password(user_id, password, actor_code=SYSTEM_ACTOR, force_password_change=True)
    return user_id


def bootstrap_staff_accounts(settings: dict[str, str]) -> None:
    admin_code = settings.get("bootstrap_admin_code", "admin")
    admin_password = settings.get("bootstrap_admin_password") or os.getenv("ULTRON_BOOTSTRAP_ADMIN_PASSWORD")
    admin_email = settings.get("bootstrap_admin_email") or settings.get("admin_contact_email")
    admin_phone = settings.get("bootstrap_admin_phone") or settings.get("admin_contact_phone")
    bursar_code = settings.get("bootstrap_bursar_code", "bursar")
    bursar_password = settings.get("bootstrap_bursar_password") or os.getenv("ULTRON_BOOTSTRAP_BURSAR_PASSWORD")
    bursar_email = settings.get("bootstrap_bursar_email")
    bursar_phone = settings.get("bootstrap_bursar_phone")
    admin_force_change = False
    bursar_force_change = False
    if not admin_password:
        admin_password = secrets.token_urlsafe(12)
        admin_force_change = True
        print(f"Generated bootstrap admin password for {admin_code}: {admin_password}", file=sys.stderr)
    if not bursar_password:
        bursar_password = secrets.token_urlsafe(12)
        bursar_force_change = True
        print(f"Generated bootstrap bursar password for {bursar_code}: {bursar_password}", file=sys.stderr)

    ensure_staff_account(admin_code, "System Admin", "admin", admin_password, admin_email, admin_phone, force_password_change=admin_force_change)
    ensure_staff_account(bursar_code, "School Bursar", "accountant", bursar_password, bursar_email, bursar_phone, force_password_change=bursar_force_change)


def list_students() -> list[sqlite3.Row]:
    refresh_access_states()
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                users.id, users.user_code, users.full_name, users.is_authorized, users.access_revoked,
                COALESCE(fee_status.payment_state, 'unpaid') AS payment_state,
                COALESCE(fee_status.balance_due, 0) AS balance_due,
                fee_status.due_date, COALESCE(fee_status.allowed_entry_days, 0) AS allowed_entry_days,
                COALESCE(fee_status.block_access, 0) AS block_access,
                fee_status.verification_exempt_until, fee_status.updated_at
            FROM users
            JOIN roles ON roles.id = users.role_id
            LEFT JOIN fee_status ON fee_status.user_id = users.id
            WHERE roles.name = 'student'
            ORDER BY users.full_name COLLATE NOCASE
            """
        ).fetchall()
    return list(rows)


def list_logs(limit: int = 200) -> list[sqlite3.Row]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT access_logs.*, actor.user_code AS actor_code, subject.user_code AS subject_code
            FROM access_logs
            LEFT JOIN users AS actor ON actor.id = access_logs.actor_user_id
            LEFT JOIN users AS subject ON subject.id = access_logs.subject_user_id
            ORDER BY access_logs.created_at DESC, access_logs.id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    return list(rows)


def list_notifications(status: str | None = "open", limit: int = 100) -> list[sqlite3.Row]:
    query = """
        SELECT notifications.*, users.user_code, users.full_name
        FROM notifications
        JOIN users ON users.id = notifications.user_id
    """
    params: list[object] = []
    if status:
        query += " WHERE notifications.status = ?"
        params.append(status)
    query += " ORDER BY notifications.created_at DESC, notifications.id DESC LIMIT ?"
    params.append(limit)
    with get_connection() as conn:
        rows = conn.execute(query, tuple(params)).fetchall()
    return list(rows)


def get_notification(notification_id: int) -> sqlite3.Row | None:
    with get_connection() as conn:
        return conn.execute("SELECT * FROM notifications WHERE id = ?", (notification_id,)).fetchone()


def create_notification(
    user_id: int,
    notification_type: str,
    message: str,
    actor_code: str | None = None,
    dedupe_window_minutes: int | None = 10,
) -> int:
    actor = resolve_actor(actor_code)
    if dedupe_window_minutes and dedupe_window_minutes > 0:
        with get_connection() as conn:
            row = conn.execute(
                """
                SELECT id FROM notifications
                WHERE user_id = ? AND notification_type = ? AND status = 'open'
                  AND julianday(created_at) >= julianday('now', 'utc', ?)
                ORDER BY created_at DESC LIMIT 1
                """,
                (user_id, notification_type, f"-{int(dedupe_window_minutes)} minutes"),
            ).fetchone()
        if row is not None:
            return int(row["id"])
    with get_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO notifications (user_id, notification_type, status, message, created_at) VALUES (?, ?, 'open', ?, ?)",
            (user_id, notification_type, message, utc_now()),
        )
        notification_id = int(cursor.lastrowid)
    log_event(
        event_type="notification_created",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details=message,
    )
    return notification_id


def resolve_notification(notification_id: int, actor_code: str | None = None) -> None:
    actor = resolve_actor(actor_code)
    with get_connection() as conn:
        conn.execute(
            "UPDATE notifications SET status = 'resolved', resolved_at = ?, resolved_by = ? WHERE id = ?",
            (utc_now(), actor["actor_user_id"], notification_id),
        )
    row = get_notification(notification_id)
    subject_id = int(row["user_id"]) if row else None
    log_event(
        event_type="notification_resolved",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=subject_id,
        details=f"Resolved notification #{notification_id}.",
    )


def set_student_finance_status(
    user_id: int,
    payment_state: str,
    balance_due: float,
    due_date: str | None,
    allowed_entry_days: int,
    block_access: bool,
    verification_exempt_until: str | None,
    actor_code: str | None = None,
    notes: str | None = None,
) -> None:
    user = get_user_by_id(user_id)
    if user is None or user["role_name"] != "student":
        raise ValueError("Finance status can only be updated for student accounts.")
    actor = resolve_actor(actor_code)
    with get_connection() as conn:
        _set_student_finance_status(
            conn,
            user_id=user_id,
            payment_state=payment_state,
            balance_due=balance_due,
            due_date=due_date,
            allowed_entry_days=allowed_entry_days,
            block_access=block_access,
            verification_exempt_until=verification_exempt_until,
            actor_user_id=actor["actor_user_id"],
            notes=notes,
        )
    refresh_access_states()
    log_event(
        event_type="student_finance_updated",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details=(
            f"payment_state={payment_state.strip().lower()}, balance_due={round(balance_due, 2)}, "
            f"due_date={normalize_optional_date(due_date) or 'none'}, "
            f"allowed_entry_days={max(allowed_entry_days, 0)}, block_access={int(block_access)}."
        ),
    )


def _set_student_finance_status(
    conn: sqlite3.Connection,
    user_id: int,
    payment_state: str,
    balance_due: float,
    due_date: str | None,
    allowed_entry_days: int,
    block_access: bool,
    verification_exempt_until: str | None,
    actor_user_id: int | None,
    notes: str | None = None,
) -> None:
    payment_state = payment_state.strip().lower()
    if payment_state not in FEE_STATES:
        raise ValueError(f"Unsupported payment state: {payment_state}")
    if balance_due < 0:
        raise ValueError("Balance due cannot be negative.")
    now = utc_now()
    conn.execute(
        """
        INSERT INTO fee_status (
            user_id, payment_state, due_date, last_payment_at, updated_by, updated_at, notes,
            balance_due, allowed_entry_days, block_access, verification_exempt_until
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            payment_state = excluded.payment_state,
            due_date = excluded.due_date,
            updated_by = excluded.updated_by,
            updated_at = excluded.updated_at,
            notes = excluded.notes,
            balance_due = excluded.balance_due,
            allowed_entry_days = excluded.allowed_entry_days,
            block_access = excluded.block_access,
            verification_exempt_until = excluded.verification_exempt_until
        """,
        (
            user_id,
            payment_state,
            normalize_optional_date(due_date),
            now if payment_state == "full" else None,
            actor_user_id,
            now,
            notes,
            round(balance_due, 2),
            max(allowed_entry_days, 0),
            int(block_access),
            normalize_optional_date(verification_exempt_until),
        ),
    )


def set_fee_status(
    user_id: int,
    payment_state: str,
    due_date: str | None,
    grace_period_days: int = 0,
    actor_code: str | None = None,
    notes: str | None = None,
) -> None:
    set_student_finance_status(
        user_id=user_id,
        payment_state=payment_state,
        balance_due=0.0,
        due_date=due_date,
        allowed_entry_days=grace_period_days,
        block_access=False,
        verification_exempt_until=None,
        actor_code=actor_code,
        notes=notes,
    )


def determine_student_authorization(block_access: bool, override_authorized: bool, is_active: bool) -> bool:
    if not is_active:
        return False
    if override_authorized:
        return True
    return not block_access


def refresh_access_states() -> None:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                users.id, users.is_active, users.access_revoked, users.override_authorized,
                roles.name AS role_name, COALESCE(fee_status.block_access, 0) AS block_access
            FROM users
            JOIN roles ON roles.id = users.role_id
            LEFT JOIN fee_status ON fee_status.user_id = users.id
            """
        ).fetchall()
        for row in rows:
            if row["role_name"] == "student":
                authorized = determine_student_authorization(
                    block_access=bool(row["block_access"]),
                    override_authorized=bool(row["override_authorized"]),
                    is_active=bool(row["is_active"]),
                )
            else:
                authorized = bool(row["is_active"]) and not bool(row["access_revoked"])
            conn.execute(
                "UPDATE users SET is_authorized = ?, access_revoked = ?, updated_at = ? WHERE id = ?",
                (int(authorized), int(not authorized), utc_now(), row["id"]),
            )
            conn.execute(
                """
                UPDATE pin_store
                SET is_active = ?,
                    revoked_at = CASE WHEN ? = 1 THEN NULL ELSE COALESCE(revoked_at, ?) END
                WHERE user_id = ?
                """,
                (int(authorized), int(authorized), utc_now(), row["id"]),
            )


def set_user_access(
    user_id: int,
    authorized: bool,
    actor_code: str | None = None,
    reason: str | None = None,
    override: bool = False,
) -> None:
    actor = resolve_actor(actor_code)
    with get_connection() as conn:
        now = utc_now()
        conn.execute(
            "UPDATE users SET override_authorized = ?, is_authorized = ?, access_revoked = ?, updated_at = ? WHERE id = ?",
            (int(override and authorized), int(authorized), int(not authorized), now, user_id),
        )
        conn.execute("UPDATE fee_status SET block_access = ? WHERE user_id = ?", (int(not authorized), user_id))
        if authorized:
            conn.execute(
                "UPDATE pin_store SET is_active = 1, revoked_at = NULL, updated_by = ? WHERE user_id = ?",
                (actor["actor_user_id"], user_id),
            )
        else:
            _revoke_pin(conn, user_id, actor["actor_user_id"])
    log_event(
        event_type="access_override" if override else "access_state_changed",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details=reason or f"Authorized set to {int(authorized)}.",
    )


def _upsert_pin(
    conn: sqlite3.Connection,
    user_id: int,
    pin: str,
    actor_user_id: int | None,
    active: bool = True,
) -> None:
    if not pin.isdigit() or len(pin) < 4:
        raise ValueError("PIN must contain only digits and be at least 4 digits long.")
    salt = os.urandom(16)
    pin_hash = hashlib.pbkdf2_hmac("sha256", pin.encode("utf-8"), salt, 120000).hex()
    conn.execute(
        """
        INSERT INTO pin_store (user_id, pin_hash, pin_salt, is_active, issued_at, revoked_at, updated_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            pin_hash = excluded.pin_hash,
            pin_salt = excluded.pin_salt,
            is_active = excluded.is_active,
            issued_at = excluded.issued_at,
            revoked_at = excluded.revoked_at,
            updated_by = excluded.updated_by
        """,
        (
            user_id,
            pin_hash,
            salt.hex(),
            int(active),
            utc_now(),
            None if active else utc_now(),
            actor_user_id,
        ),
    )


def upsert_pin(user_id: int, pin: str, actor_code: str | None = None, active: bool = True) -> None:
    actor = resolve_actor(actor_code)
    with get_connection() as conn:
        _upsert_pin(conn, user_id, pin, actor["actor_user_id"], active=active)
    log_event(
        event_type="pin_updated",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details=f"PIN {'activated' if active else 'revoked'} for user_id={user_id}.",
    )


def reset_pin(user_id: int, new_pin: str, actor_code: str | None = None) -> None:
    upsert_pin(user_id, new_pin.strip(), actor_code=actor_code, active=True)


def _revoke_pin(conn: sqlite3.Connection, user_id: int, actor_user_id: int | None) -> None:
    conn.execute(
        "UPDATE pin_store SET is_active = 0, revoked_at = ?, updated_by = ? WHERE user_id = ?",
        (utc_now(), actor_user_id, user_id),
    )


def revoke_pin(user_id: int, actor_code: str | None = None) -> None:
    actor = resolve_actor(actor_code)
    with get_connection() as conn:
        _revoke_pin(conn, user_id, actor["actor_user_id"])
    log_event(
        event_type="pin_revoked",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details=f"PIN revoked for user_id={user_id}.",
    )


def verify_pin(user_code: str, pin: str) -> bool:
    user = get_user_by_code(user_code)
    if user is None or not user["is_authorized"]:
        return False
    with get_connection() as conn:
        row = conn.execute(
            "SELECT pin_hash, pin_salt, is_active FROM pin_store WHERE user_id = ?",
            (user["id"],),
        ).fetchone()
    if row is None or not row["is_active"]:
        return False
    computed = hashlib.pbkdf2_hmac("sha256", pin.encode("utf-8"), bytes.fromhex(row["pin_salt"]), 120000).hex()
    return computed == row["pin_hash"]


def create_invoice(
    user_id: int,
    description: str,
    total_amount: float,
    due_date: str | None,
    actor_code: str | None = None,
) -> int:
    if total_amount <= 0:
        raise ValueError("Invoice amount must be greater than zero.")
    actor = resolve_actor(actor_code)
    now = utc_now()
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO invoices (
                user_id, description, total_amount, balance_amount, due_date,
                status, created_by, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, 'open', ?, ?, ?)
            """,
            (
                user_id,
                description.strip(),
                round(total_amount, 2),
                round(total_amount, 2),
                normalize_optional_date(due_date),
                actor["actor_user_id"],
                now,
                now,
            ),
        )
        invoice_id = int(cursor.lastrowid)
    recalculate_student_balance(user_id, actor_code=actor_code)
    log_event(
        event_type="invoice_created",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details=f"Created invoice #{invoice_id} for {round(total_amount, 2)}.",
    )
    return invoice_id


def list_invoices(user_id: int | None = None) -> list[sqlite3.Row]:
    query = "SELECT invoices.*, users.user_code, users.full_name FROM invoices JOIN users ON users.id = invoices.user_id"
    params: tuple[object, ...] = ()
    if user_id is not None:
        query += " WHERE invoices.user_id = ?"
        params = (user_id,)
    query += " ORDER BY invoices.created_at DESC, invoices.id DESC"
    with get_connection() as conn:
        return list(conn.execute(query, params).fetchall())


def list_payments(user_id: int | None = None) -> list[sqlite3.Row]:
    query = "SELECT payments.*, users.user_code, users.full_name FROM payments JOIN users ON users.id = payments.user_id"
    params: tuple[object, ...] = ()
    if user_id is not None:
        query += " WHERE payments.user_id = ?"
        params = (user_id,)
    query += " ORDER BY payments.created_at DESC, payments.id DESC"
    with get_connection() as conn:
        return list(conn.execute(query, params).fetchall())


def record_payment(
    user_id: int,
    amount: float,
    method: str,
    actor_code: str | None = None,
    invoice_id: int | None = None,
    reference: str | None = None,
    notes: str | None = None,
) -> int:
    if amount <= 0:
        raise ValueError("Payment amount must be greater than zero.")
    method = method.strip().lower()
    if method not in PAYMENT_METHODS:
        raise ValueError(f"Unsupported payment method: {method}")
    actor = resolve_actor(actor_code)
    remaining = round(amount, 2)

    with get_connection() as conn:
        if invoice_id is not None:
            invoices = conn.execute("SELECT * FROM invoices WHERE id = ? AND user_id = ?", (invoice_id, user_id)).fetchall()
        else:
            invoices = conn.execute(
                "SELECT * FROM invoices WHERE user_id = ? AND status != 'paid' ORDER BY due_date IS NULL, due_date, created_at",
                (user_id,),
            ).fetchall()

        for invoice in invoices:
            if remaining <= 0:
                break
            apply_amount = min(remaining, float(invoice["balance_amount"]))
            if apply_amount <= 0:
                continue
            remaining = round(remaining - apply_amount, 2)
            new_balance = round(float(invoice["balance_amount"]) - apply_amount, 2)
            status = "paid" if new_balance <= 0 else "partial"
            conn.execute(
                "UPDATE invoices SET balance_amount = ?, status = ?, updated_at = ? WHERE id = ?",
                (new_balance, status, utc_now(), invoice["id"]),
            )

        cursor = conn.execute(
            """
            INSERT INTO payments (
                user_id, invoice_id, amount, payment_date, method, reference, notes, recorded_by, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                invoice_id,
                round(amount, 2),
                utc_now(),
                method,
                (reference or "").strip() or None,
                notes,
                actor["actor_user_id"],
                utc_now(),
            ),
        )
        payment_id = int(cursor.lastrowid)

    recalculate_student_balance(user_id, actor_code=actor_code)
    log_event(
        event_type="payment_recorded",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details=f"Recorded payment #{payment_id} for {round(amount, 2)} via {method}.",
    )
    return payment_id


def get_student_finance_profile(user_id: int) -> sqlite3.Row | None:
    with get_connection() as conn:
        return conn.execute(
            """
            SELECT fee_status.*, users.user_code, users.full_name
            FROM fee_status
            JOIN users ON users.id = fee_status.user_id
            WHERE fee_status.user_id = ?
            """,
            (user_id,),
        ).fetchone()


def get_student_record(user_id: int) -> sqlite3.Row | None:
    with get_connection() as conn:
        return conn.execute(
            """
            SELECT
                users.*,
                roles.name AS role_name,
                COALESCE(fee_status.payment_state, 'unpaid') AS payment_state,
                COALESCE(fee_status.balance_due, 0) AS balance_due,
                fee_status.due_date,
                COALESCE(fee_status.allowed_entry_days, 0) AS allowed_entry_days,
                COALESCE(fee_status.block_access, 0) AS block_access,
                fee_status.verification_exempt_until
            FROM users
            JOIN roles ON roles.id = users.role_id
            LEFT JOIN fee_status ON fee_status.user_id = users.id
            WHERE users.id = ?
            """,
            (user_id,),
        ).fetchone()


def get_student_record_by_code(user_code: str) -> sqlite3.Row | None:
    user = get_user_by_code(user_code)
    if user is None:
        return None
    return get_student_record(int(user["id"]))


def list_student_receipts(user_id: int) -> list[sqlite3.Row]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                payments.id,
                payments.amount,
                payments.method,
                payments.payment_date,
                payments.reference,
                payments.notes,
                invoices.description AS invoice_description
            FROM payments
            LEFT JOIN invoices ON invoices.id = payments.invoice_id
            WHERE payments.user_id = ?
            ORDER BY payments.payment_date DESC, payments.id DESC
            """,
            (user_id,),
        ).fetchall()
    return list(rows)


def create_student_request(
    user_id: int,
    request_type: str,
    message: str,
    actor_code: str | None = None,
) -> int:
    request_type = request_type.strip().lower()
    message = message.strip()
    if not message:
        raise ValueError("Request message is required.")
    user = get_user_by_id(user_id)
    if user is None:
        raise ValueError("Student request user not found.")
    actor = resolve_actor(actor_code or user["user_code"])
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO student_requests (user_id, request_type, message, status, created_at)
            VALUES (?, ?, ?, 'open', ?)
            """,
            (user_id, request_type, message, utc_now()),
        )
        request_id = int(cursor.lastrowid)
    notification_type = "student_payment_notice" if request_type == "payment_notice" else "student_change_request"
    create_notification(
        user_id=user_id,
        notification_type=notification_type,
        message=f"Student request: {request_type}. {message}",
        actor_code=actor["actor_label"],
        dedupe_window_minutes=None,
    )
    log_event(
        event_type="student_request_created",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=user_id,
        details=f"Student request #{request_id} created: {request_type}.",
    )
    return request_id


def list_student_requests(user_id: int | None = None, status: str | None = None, limit: int = 200) -> list[sqlite3.Row]:
    query = """
        SELECT
            student_requests.*,
            users.user_code,
            users.full_name
        FROM student_requests
        JOIN users ON users.id = student_requests.user_id
    """
    clauses = []
    params: list[object] = []
    if user_id is not None:
        clauses.append("student_requests.user_id = ?")
        params.append(user_id)
    if status:
        clauses.append("student_requests.status = ?")
        params.append(status)
    if clauses:
        query += " WHERE " + " AND ".join(clauses)
    query += " ORDER BY student_requests.created_at DESC, student_requests.id DESC LIMIT ?"
    params.append(limit)
    with get_connection() as conn:
        rows = conn.execute(query, tuple(params)).fetchall()
    return list(rows)


def resolve_student_request(request_id: int, resolution_note: str | None = None, actor_code: str | None = None) -> None:
    actor = resolve_actor(actor_code)
    with get_connection() as conn:
        row = conn.execute("SELECT user_id FROM student_requests WHERE id = ?", (request_id,)).fetchone()
        if row is None:
            raise ValueError("Student request not found.")
        conn.execute(
            """
            UPDATE student_requests
            SET status = 'resolved',
                resolved_at = ?,
                resolved_by = ?,
                resolution_note = ?
            WHERE id = ?
            """,
            (utc_now(), actor["actor_user_id"], (resolution_note or "").strip() or None, request_id),
        )
    log_event(
        event_type="student_request_resolved",
        outcome="success",
        actor_code=actor["actor_label"],
        actor_user_id=actor["actor_user_id"],
        subject_user_id=int(row["user_id"]),
        details=f"Resolved student request #{request_id}.",
    )


def recalculate_student_balance(user_id: int, actor_code: str | None = None) -> None:
    user = get_user_by_id(user_id)
    if user is None or user["role_name"] != "student":
        return
    with get_connection() as conn:
        outstanding = conn.execute(
            "SELECT COALESCE(SUM(balance_amount), 0) AS total, COALESCE(SUM(total_amount), 0) AS original_total FROM invoices WHERE user_id = ?",
            (user_id,),
        ).fetchone()
        current = conn.execute(
            """
            SELECT payment_state, due_date, allowed_entry_days, block_access, verification_exempt_until, notes
            FROM fee_status WHERE user_id = ?
            """,
            (user_id,),
        ).fetchone()
    total = round(float(outstanding["total"] or 0), 2)
    original_total = round(float(outstanding["original_total"] or 0), 2)
    if total <= 0:
        payment_state = "full"
    elif original_total > 0:
        payment_state = "partial" if 0 < total < original_total else "unpaid"
    else:
        payment_state = current["payment_state"] if current else "unpaid"
    set_student_finance_status(
        user_id=user_id,
        payment_state=payment_state,
        balance_due=total,
        due_date=current["due_date"] if current else None,
        allowed_entry_days=int(current["allowed_entry_days"] or 0) if current else 0,
        block_access=bool(current["block_access"]) if current else False,
        verification_exempt_until=current["verification_exempt_until"] if current else None,
        actor_code=actor_code,
        notes=current["notes"] if current else None,
    )


def get_dashboard_summary() -> dict[str, int | float]:
    students = list_students()
    outstanding = sum(1 for row in students if float(row["balance_due"]) > 0)
    blocked = sum(1 for row in students if row["block_access"])
    with get_connection() as conn:
        invoice_total = conn.execute("SELECT COALESCE(SUM(balance_amount), 0) AS total FROM invoices").fetchone()["total"]
        open_notifications = conn.execute("SELECT COUNT(*) AS count FROM notifications WHERE status = 'open'").fetchone()["count"]
    return {
        "students": len(students),
        "outstanding_students": outstanding,
        "blocked_students": blocked,
        "open_notifications": int(open_notifications),
        "outstanding_balance": round(float(invoice_total or 0), 2),
    }


def evaluate_gate_access(
    identity_status: str,
    user_code: str | None = None,
    confidence: float | None = None,
    fallback_user_code: str | None = None,
    actor_code: str | None = None,
) -> dict[str, object]:
    identity_status = identity_status.strip().lower()
    if identity_status not in GATE_DECISION_TYPES:
        raise ValueError(f"Unsupported identity status: {identity_status}")

    actor = resolve_actor(actor_code)
    confidence = 0.0 if confidence is None else float(confidence)

    if identity_status == "unknown":
        log_event(
            event_type="gate_face_unrecognized",
            outcome="warning",
            actor_code=actor["actor_label"],
            actor_user_id=actor["actor_user_id"],
            details="Unknown face presented at gate.",
        )
        if fallback_user_code:
            return evaluate_gate_access(
                identity_status="recognized",
                user_code=fallback_user_code,
                confidence=1.0,
                actor_code=actor_code,
            )
        return {
            "recognized": False,
            "granted": False,
            "decision": "unknown_face",
            "message": "Face not recognized. No bursar notification sent until identity is confirmed.",
        }

    if identity_status == "low_confidence":
        log_event(
            event_type="gate_low_confidence_match",
            outcome="warning",
            actor_code=actor["actor_label"],
            actor_user_id=actor["actor_user_id"],
            details=f"Low-confidence face match at gate. confidence={confidence:.2f}",
        )
        if fallback_user_code:
            return evaluate_gate_access(
                identity_status="recognized",
                user_code=fallback_user_code,
                confidence=1.0,
                actor_code=actor_code,
            )
        return {
            "recognized": False,
            "granted": False,
            "decision": "manual_review",
            "message": "Face match confidence too low. Require PIN or staff verification before notifying bursar.",
        }

    if not user_code:
        raise ValueError("user_code is required for recognized gate decisions.")

    user = get_user_by_code(user_code)
    if user is None:
        return evaluate_gate_access("unknown", actor_code=actor_code)

    granted = bool(user["is_authorized"])
    notification_id = None
    decision = "recognized_allowed" if granted else "recognized_denied"
    message = "Pass granted."

    if granted:
        log_event(
            event_type="gate_pass_granted",
            outcome="success",
            actor_code=actor["actor_label"],
            actor_user_id=actor["actor_user_id"],
            subject_user_id=int(user["id"]),
            details=f"{user['full_name']} ({user['user_code']}) granted at gate with confidence {confidence:.2f}.",
        )
    else:
        log_event(
            event_type="gate_pass_denied",
            outcome="warning",
            actor_code=actor["actor_label"],
            actor_user_id=actor["actor_user_id"],
            subject_user_id=int(user["id"]),
            details=f"{user['full_name']} ({user['user_code']}) denied at gate with confidence {confidence:.2f}.",
        )

    if user["role_name"] == "student":
        finance = get_student_finance_profile(int(user["id"]))
        has_balance_issue = finance and (finance["payment_state"] != "full" or float(finance["balance_due"]) > 0)
        if granted and has_balance_issue:
            notification_id = create_notification(
                user_id=int(user["id"]),
                notification_type="gate_fee_alert",
                message=(
                    f"{user['full_name']} entered school with outstanding fees. "
                    f"State={finance['payment_state']}, balance_due={round(float(finance['balance_due']), 2)}."
                ),
                actor_code=actor_code,
            )
            message = "Pass granted and accountant notified about outstanding fees."
            decision = "granted_with_fee_alert"
        elif not granted:
            reason = "manual block or finance restriction"
            if finance and finance["block_access"]:
                reason = "accountant/admin block"
            notification_id = create_notification(
                user_id=int(user["id"]),
                notification_type="gate_denied_alert",
                message=f"{user['full_name']} is at the gate and has been denied access due to {reason}.",
                actor_code=actor_code,
            )
            message = "Access denied and bursar/accountant notified."
            decision = "denied_with_bursar_alert"

    return {
        "recognized": True,
        "granted": granted,
        "decision": decision,
        "message": message,
        "notification_id": notification_id,
        "user_id": int(user["id"]),
    }


def record_gate_event(user_code: str, actor_code: str | None = None) -> dict[str, object]:
    return evaluate_gate_access(
        identity_status="recognized",
        user_code=user_code,
        confidence=1.0,
        actor_code=actor_code,
    )
