export const VALIDATION_MESSAGES = {
  MIN_DATE_TOMORROW:
    "Najbliższa możliwa data do ustawienia to dzień jutrzejszy.",
  USERNAME_REQUIRED: "Nazwa użytkownika jest wymagana.",
  PASSWORD_REQUIRED: "Hasło jest wymagane.",
  ONE_VALUE_MUST_BE_CHOSEN: "Jedna opcja musi byc wybrana.",
  MIN_VALUE_1: "Minimalna wartość to 1.",
  MIN_VALUE_0: "Minimalna wartość to 0.",
  MIN_VALUE_6: "Minimalna wartość to 6.",
  MAX_VALUE_100: "Maksymalna wartość to 100.",
  MAX_VALUE_13: "Maksymalna wartość to 13.",
  MAX_VALUE_INTEGER: "Maksymalna wartość została przekroczona.",
  FIELD_REQUIRED: "Pole jest wymagane.",
  DATE_FORMAT: "Wartość musi być poprawną datą.",
  MUST_BE_INTEGER: "Wartość musi być liczbą całkowitą.",
  MUST_BE_FLOAT: "Wartość musi być liczbą.",
  MAX_VALUE_EXCEEDED: "Maksymalna wartość została przekroczona.",
  POSITIVE: "Wartość musi być większa od zera.",
  IS_DECIMAL_WITH_MAX_TWO_DIGITS:
    "Wartość musi być liczbą z maksymalnie dwoma cyframi po przecinku. ",
  NO_GOOD: "Wartość jest niepoprawna.",
} as const;

export const ERROR_MESSAGES = {
  QUANTITY_TO_BE_SENT_WAS_ZERO:
    "Wybrana ilość była zerowa. Nie przesłano żadnych danych!",
  CANNOT_ORDER_AFTER_13:
    "Po godzinie 13:00 nie ma możliwości ustawienia zlecenia na dzisiaj lub jutro.",
  CANNOT_ORDER_AFTER_13_FOR_TOMORROW_AND_DAY_AFTER_TOMORROW:
    "Po godzinie 13:00 nie ma możliwości ustawienia zlecenia na pojutrze.",
  CANNOT_SEND_ERROR_TO_PRODUCER_LACK_OF_DATA:
    "Informacja nie może być wysłana do firmy Korsol, brakuje danych błędu.",
  CANNOT_SEND_ERROR_TO_PRODUCER:
    "Informacja nie może być wysłana do firmy Korsol.",
  NO_REASON_PROVIDED: "Brak informacji o powodzie odpięcia do bufora.",
  TRAY_ALREADY_IN_GARDEN: "Taca znajduje się już w ogródku.",
  TRAY_ALREADY_IN_LIST: "Taca znajduje się już na liście.",
  NO_INFO_ABOUT_TRAYS: "Brak informacji o starej lub nowej tacy.",
  TRAY_IS_NOT_CLEANED_OR_IS_DESTROYED:
    "Nowa taca nie została umyta lub jest przeznaczona do zniszczenia! Wykonaj czynności od początku.",
  TRAY_IS_NOT_SOWN:
    "Wymieniana taca nie jest wysiana! Wykonaj czynności od początku.",
  WRONG_PIN: "Wpisano zły PIN.",
  NO_PIN_FOR_MODULE: "Ten moduł nie posiada PINu.",
  TRAY_ALREADY_DESTROYED:
    "Taca została już zeskanowana do protokołu zniszczenia!",
  NEW_TRAY_MUST_BE_DIFFERENT_FROM_OLD_TRAY:
    "Nowa taca musi być inna niż stara taca.",
  TRAY_LACKS_DATA: "Brakuje informacji w zeskanowanej tacy.",
  WATERING_PLANT_ACTIVITY_NOT_DELIVERED: `Brak informacji z raportu o pracy "Podlewanie".`,
  NOTHING_WAS_CHOSEN: "Nic nie zostało wybrane.",
  ONLY_FIELD_AVAILABLE:
    " Tylko skanowanie lokalizacji dostępne jest w tym module.",
  ORDER_HAS_NOT_ENOUGH_TRAYS_TO_FULFILL_ORDER:
    "UWAGA. Zlecenie niepełne — nie ma wystarczającej ilości roślin po przeliczeniu wschodów.",
  ZP_NOT_PREPARED_TO_EXPORT: "Zlecenie nie jest przygotowane do wywozu.",
  ZP_WAS_ALREADY_ORDERED_TO_CUT: "To zlecenie już zaplanowano na ",
  CANNOT_CONFIRM_ZP_WAS_NOT_ORDERED:
    "ZPek nie znajduje się na liście zleconej do cięcia.",
  PROBLEM_WITH_CREATING_DOCID: "Nastąpił problem przy tworzeniu docId.",
  CANNOT_SEND_PICTURES: "Brak danych, by przesłać zdjęcia na serwer.",
  PICTURE_CANNOT_BE_DELETED:
    "Zdjęcie nie może być skasowane, brak informacji, które zdjęcie mam skasować.",
  COULD_NOT_TAKE_PHOTO:
    "Wystąpił problem podczas robienia zdjęcia, spróbuj ponownie.",
  DAY_UNAVAILABLE_WITHOUT_SUPERDATA: `Bez włączonej opcji "Superdata" ta data wywozu do klienta jest niedostępna - zmień datę wywozu.`,
  NO_EARLIER_INTERNAL_MOVEMENTS:
    "Brak transportu wewnętrznego uniemożliwia zlecenie wywozu do klienta!",
  NO_TMS_DATE_IN_ZP: "Brak daty TMS — skontaktuj się z administratorem.",
  DATE_OF_ORDER_EXPORT_TO_CUSTOMER_ALREADY_SET:
    "Data wywozu tego zlecenia do klienta została już ustalona na dzień: ",
  NO_FIELD_POSSIBLE:
    "W tym module nie możesz zeskanować kodu całej lokalizacji.",
  NO_ZP_ROZ_POSSIBLE: "W tym module nie możesz zeskanować kodu ZP rozsady.",
  NO_ZP_GRU_POSSIBLE: "W tym module nie możesz zeskanować kodu ZP gruntówki.",
  NO_TRAY_POSSIBLE: "W tym module nie możesz zeskanować kodu tacy.",
  ONLY_TRAY_POSSIBLE: "Możesz zeskanować tylko QR kod tacy.",
  ONLY_ZP_POSSIBLE: "Możesz zeskanować tylko QR kod ZPka.",
  WORK_TO_PLAN_IS_ALREADY_DONE:
    "Nie możesz zaplanować tej pracy, jej wykonanie zostało już potwierdzone.",
  ONLY_ZP_OR_LOCALIZATION_POSSIBLE:
    "Możesz zeskanować tylko QR kod lokalizacji lub ZPka.",
  NO_ZPS_WHERE_DATE_OF_ORDER_TO_INTERNAL_TRANSPORT_WAS_NOT_SET:
    "W zeskanowanej lokalizacji brak ZPków, których data zlecenia transportu wewnętrznego nie została jeszcze ustalona.",
  NO_ZPS_WHERE_DATE_OF_ORDER_TO_HARDENER_WAS_NOT_SET:
    "W zeskanowanej lokalizacji brak ZPków, których data wywozu na hartownik nie została jeszcze ustalona.",
  ZP_CANNOT_BE_DELETED_NO_INFO:
    "Nie można usunąć zlecenia, brak wystarczających informacji.",
  CANNOT_SCAN_FIELD_WHEN_ROZ:
    "W lokalizacji znajdują się rozsady szklarniowe, nie możesz użyć tego modułu aplikacji.",
  WRONG_PARAMETER: "Przekazano zły parametr.",
  MODULE_DOESNT_HANDLE_WITH_TRAY_QR:
    "Ten moduł nie obsługuje skanowania QR kodu tacy.",
  LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT:
    "Nie mogę przesłać danych, gdyż nie są kompletne.",
  CHOSEN_ZP_HAS_NO_TRAYS_IN_SCANNED_LOCALIZATION:
    "Wybrany ZPek nie ma tac w zeskanowanej lokalizacji.",
  BAD_QR_CODE: "Zeskanowany kod QR jest niepoprawny.",
  NO_TRAY_ON_THE_LIST: "Nie znaleziono wybranej tacy na liście.",
  NUMBER_OF_TRAY_BAD_PLANTS_CANNOT_BE_LESS_THAN_0:
    "Liczba braków na tacy nie może być mniejsza od zera.",
  NO_INFO_TO_SEND: "Brak informacji do wysłania.",
  NO_INFO_ABOUT_TRAY: "Brak informacji o tacy.",
  NO_INFO_ABOUT_LOCALIZATION: "Brak informacji o lokalizacji.",
  NO_INFO_ABOUT_WORK_TO_PLAN: "Brak informacji o pracy do zaplanowania.",
  LOCALIZATION_NOT_FOUND: "W systemie nie znaleziono lokalizacji.",
  MODULE_NOT_AVAILABLE_FOR_THIS_USER:
    "Zalogowany użytkownik nie ma dostępu do tego modułu.",
  APP_NOT_UP_TO_DATE: "Posiadasz nieaktualną wersję. Uaktualnij aplikację.",
  CANNOT_SCAN_FIELD_WHEN_ZP_SCANNED_EARLIER:
    "Nie można zeskanować lokalizacji, jeżeli wcześniej zeskanowano jakiś ZP.",
  NOT_FOUND_IN_LOC: "Nie odnaleziony na obiekcie.",
  NO_ZP_ON_FIELD: "Brak ZPków w lokalizacji.",
  USER_NOT_VERIFIED: "Brak uprawnień.",
  OFFLINE: "Brak połączenia z internetem.",
  BAD_REQUEST: "Błąd w zapytaniu. Serwer odrzucił to zapytanie.",
  NETWORK_ERROR: "Problemy z połączeniem internetowym.",
  PROBLEM_WHEN_LOGIN: "Wystąpił problem podczas logowania, spróbuj ponownie.",
  ERROR_IN_TOKENS:
    "Wystąpił problem podczas pobierania tokenu, spróbuj ponownie.",
  ERROR_IN_USER_DATA:
    "Próba pobrania danych użytkownika zakończona niepowodzeniem",
  SESSION_EXPIRED:
    "Zły token. Twoja sesja najprawdopodobniej wygasła. Zaloguj się ponownie.",
  TOP_TABS_EMPTY: "Dane przekazane do modułu TopTab są niepoprawne.",
  TOP_TABS_ACTIVE_COMPONENT_KEY_NOT_FOUND:
    "TopTab klucz aktywnego komponentu nie został przekazany, lub jest niepoprawny.",
  VALUE_ALREADY_SCANNED: "Kod został już wcześniej zeskanowany.",
  ZP_WAS_ALREADY_SCANNED_AND_IS_ON_LIST:
    "ZP został już wcześniej zeskanowany i znajduje się na liście.",
  HAVE_NO_IDEA_ERROR: "Pojawił się nieoczekiwany błąd.",
  PRODUCTION_ORDER_BAD_PREFIX:
    "Zeskanowane zlecenie produkcyjne lub pole ma zły format. Powinno rozpoczynać się od przedrostka 'ZLEC_ZP' lub 'POLE_'.",
  PRODUCTION_ORDER_BAD_SUFFIX:
    "Zeskanowane zlecenie produkcyjne ma zły format. Powinno kończyć się znakami 'GRU'.",
  PRODUCTION_ORDER_BAD_VALUE: "Zeskanowa wartość jest niepoprawna.",
  LACK_OF_EXTRA_WORK: "Brak informacji o wykonanej pracy extra.",
  LACK_OF_NITROGEN_CONCENTRATION: "Brak informacji o stężeniu azotu.",
  LACK_OF_ZP: "Brak informacji o zeskanowanych ZP-kach.",
  LACK_OF_CHOSEN_ZP: "Brak informacji o wybranym ZP-ku.",
  LACK_OF_DATE: "Brak informacji o dacie wykonania pracy extra.",
  LACK_OF_TARGET_LOCALIZATION: "Brak docelowej lokalizacji.",
  LACK_OF_WORK_TO_PLAN: "Brak informacji o pracy, jaka ma być zaplanowana.",
  LACK_OF_IN_HOW_MANY_DAYS:
    "Brak informacji za ile dni ma być przeniesione na hartownik.",
  LACK_OF_IN_HOW_MANY_DAYS_TO_WORK_PLAN:
    "Brak informacji za ile dni praca ma być wykonana.",
  LACK_OF_IN_HOW_MANY_DAYS_TO_IRRIGATE_WITH_NITROGEN:
    "Brak informacji za ile dni ma być podlane azotem.",
  LACK_OF_ACTIVITY:
    "Nie mogę przesłać danych. Brak informacji o wybranej aktywności.",
  LACK_OF_SCANNED_VALUE:
    "Nie mogę przesłać danych. Brak informacji o zeskanowanym ZP.",
  PROBLEM_WHEN_SENDING_DATA:
    "Wystąpił problem podczas przesyłania danych, spróbuj ponownie.",
  NO_FUTURE_DATA: "Data może być późniejsza niż dzisiaj.",
  CANNOT_AUTOMATICALLY_UPDATE:
    "Brak możliwości uaktualnienia danych automatycznie, wyjdź z tego modułu i zeskanuj ZP raz jeszcze.",
} as const;

export const MESSAGES = {
  ERROR_DATA_SENT_SUCCESSFULLY:
    "Informacja o błędzie została wysłana do firmy Korsol.",
  GOOD_PIN: "PIN poprawny.",
  LACK_OF_ZPS_TO_CUT: "Brak ZPków zaplanowanych do cięcia.",
  FORCE_CHANGE_WHO_DID_PROTECTIVE_TREATMENT_TO_ROBOT: `Ponieważ zeskanowano całą nawę, pole "Wykonał" zostało automatycznie zmienione na wartość "Robot".`,
  SEND_DATA_WITH_SUCCESS: "Pomyślnie przesłano dane.",
  LACK_OF_SCANNED_ZPS: "Brak zeskanowanych ZP'ków.",
  LACK_OF_SCANNED_ZP: "Nie zeskanowano ZPka",
  LACK_OF_ACTIVITY_DETAILS: "Brak materiałów do potwierdzenia ilości.",
  LACK_OF_EXTRA_WORKS: "Brak prac.",
  LACK_OF_SCANNED_ZP_OR_TRAY: "Nie zeskanowano ZPka lub tacy",
  LACK_OF_TAKEN_PHOTOS: "Brak zrobionych zdjęć.",
  LACK_OF_SCANNED_TRAYS: "Brak zeskanowanych tac.",
  LACK_OF_SCANNED_TRAY: "Brak zeskanowanej tacy.",
  LACK_OF_DAMAGED_TRAYS: "Brak zniszczonych tac dla takiego zakresu i daty.",
  ZP_DELETED_SUCCESS: "Pomyślnie usunięto zlecenie.",
  ZP_DELETED_SUCCESS_FROM_LIST: "Pomyślnie usunięto zlecenie z listy.",
  PICTURE_DELETED_SUCCESS: "Pomyślnie usunięto zdjęcie.",
  DATA_SENT_SUCCESSFULLY: "Pomyślnie przesłano dane.",
  VALUE_CHANGED_WITH_SUCCESS: "Pomyślnie zmieniono wartość.",
  TRAY_REMOVED_WITH_SUCCESS: "Pomyślnie usunięto tacę z listy.",
} as const;

export const ERROR_TITLES = {
  UNFORTUNATELY: "Niestety",
} as const;

export const provideNoAccessToSubmoduleMessage = (
  moduleName: string
): string => {
  return `Brak dostępu do modułu: ${moduleName} .`;
};
