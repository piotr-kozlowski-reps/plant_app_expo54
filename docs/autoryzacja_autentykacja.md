# Dokumentacja dla: features/auth

## 📄 features/auth/domain/useLoginLogic.tsx

REALIZACJA:

---

pobranie tokenów:
{{URL}}/api.php/REST/v1/login

---

pobranie informacji o użytkowniku:
{{URL}}/api.php/REST/v1/userProfile

---

weryfikacja czy użytkownik jest adminem:
{{URL}}/api.php/REST/v1/userProfile

---

przesłanie informacji o telefonie, OS telefonu i wersji aplikacji (tylko produkcja):
{{URL}}/api.php/REST/v1/customRegisters/240/entries

---

pobranie raportu o dostępie użytkownika i ostatniej wersji aplikacji jaka została użyta w systemie:
{{URL}}/api.php/REST/v1/system/reports/1567/data

-> weryfikacja czy uzytkownik ma dostęp do aplikacji

-> jeżeli jesteśmy na produkcji: weryfikacja czy aplikacja jest w najnowszej możliwej wersji

---

zapisanie informacji użytkownika w danej sesji logowania: user_info, role, tokeny, widoczność modułów/submodułów aplikacji (robiona na razie ręcznie przeze mnie)

---

## 📄 features/auth/ui/LoginForm.tsx

PROCEDURA:

formularz:
- login
- hasło

---

