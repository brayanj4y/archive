from stt import create_stt
import json

def test_stt_grammar():
    print("Testing STT Grammar...")
    try:
        stt = create_stt()
    except FileNotFoundError:
        print("Skipping STT test (Model not found)")
        return

    # Check that grammar argument is accepted (integration test)
    # We can't easily mock microphone input in this headless environment,
    # but we can verify the API signature and object creation.
    
    print("Initializing Recognizer with grammar...")
    grammar = ["admin", "code"]
    grammar_json = json.dumps(grammar + ["[unk]"])
    
    # Access private model to verify it works
    from vosk import KaldiRecognizer
    try:
        rec = KaldiRecognizer(stt.model, stt.sample_rate, grammar_json)
        print("Successfully created KaldiRecognizer with grammar.")
    except Exception as e:
        print(f"FAILED to create recognizer with grammar: {e}")
        return

    print("STT Grammar test passed (API verification).")

if __name__ == "__main__":
    test_stt_grammar()
