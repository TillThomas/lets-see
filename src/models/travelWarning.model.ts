export interface ITravelWarning {
    lastModified:	number,
    // Zeitstempel der letzten Änderung
    effective:	number,
    // Zeitstempel, seit wann der Reisehinweis gilt
    title:	string,
    // Titel des Landes
    CountryCode:	string
    // Zweistelliger Ländercode
    iso3CountryCode: string,
    // dreistelliger Ländercode
    CountryName:	string
    // (Deutscher) Name des Landes
    warning: boolean
    // Ob eine Reisewarnung ausgesprochen wurde
    partialWarning:	boolean
    // Ob eine Teilreisewarnung ausgesprochen wurde
    situationWarning:	boolean
    // Steht aktuell (Januar 2022) für „COVID-19-bedingte Reisewarnung“ kann sich in Zukunft möglicherweise ändern.
    situationPartWarning:	boolean
    // Steht aktuell (Januar 2022) für „COVID-19-bedingte Teilreisewarnung“ kann sich in Zukunft möglicherweise ändern.
}