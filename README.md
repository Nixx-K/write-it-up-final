# Portal dla Pisarzy - Instrukcja

Projekt wykonany w Angularze. Aplikacja korzysta z zamockowanego backendu, co pozwala na pełną prezentację funkcjonalności bez konieczności konfiguracji zewnętrznej bazy danych.

## Instrukcja uruchomienia (Windows)

1. Pobierz i zainstaluj **Node.js** ze strony: https://nodejs.org/ (wybierz wersję LTS).
2. Rozpakuj projekt i otwórz folder w terminalu (np. wpisz `cmd` w pasku adresu folderu).
3. Zainstaluj biblioteki wpisując komendę:
   ```cmd
   npm install
   ```
4. Uruchom aplikację komendą:
   ```cmd
   npm start
   ```
5. Po zakończeniu uruchamiania, otwórz przeglądarkę i wejdź na:
   **http://localhost:4200**

## Dane do logowania

Możesz zalogować się na jedno z poniższych kont testowych (hasło dla wszystkich to `123`):

- **Gość Testowy**: `gosc@example.com`
- **Autor (ksiazkoholik99)**: `user1@example.com`
- **Autor (mroczna_dusza)**: `user2@example.com`

Możesz również założyć własne konto korzystając z opcji **Rejestracja**.

## Funkcje aplikacji
- **System ról**: Autorzy mogą dodawać, edytować i usuwać swoje opowiadania oraz rozdziały.
- **Interakcje**: Polubienia (serduszka), system komentarzy z linkami do profili.
- **Społeczność**: Obserwowanie autorów oraz wystawianie im ocen gwiazdkowych.
- **Ranking**: Lista autorów posortowana według średniej ocen.
- **Wyszukiwanie**: Filtrowanie opowiadań po tytule, gatunku i tagach.

## Dane
Aplikacja wykorzystuje mechanizm mockowania danych. Wszystkie zmiany (nowe opowiadania, komentarze, oceny) są widoczne w trakcie trwania sesji użytkownika.
