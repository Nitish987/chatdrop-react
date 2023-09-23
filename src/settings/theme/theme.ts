class Theme {
  static light = 'light';
  static dark = 'dark';

  static loadThemeData(): string {
    /**
     * load the theme data from local storage and set the theme to app also return the theme state
     */
    const theme = localStorage.getItem('chatdrop-theme');
    const body = document.querySelector("body")!;
    if (theme) {
      if (theme === Theme.light) {
        body.setAttribute('data-theme', 'light');
        return Theme.light;
      } else {
        body.setAttribute('data-theme', 'dark');
        return Theme.dark;
      }
    }
    body.setAttribute('data-theme', 'light');
    localStorage.setItem('chatdrop-theme', Theme.light);
    return Theme.light;
  }

  static setThemeData(theme: string) {
    /**
     * set the theme data to app and save theme state in local storage
     */
    const body = document.querySelector("body")!;
    if (theme === Theme.light) {
      body.setAttribute('data-theme', 'light');
      localStorage.setItem('chatdrop-theme', Theme.light);
    } else {
      body.setAttribute('data-theme', 'dark');
      localStorage.setItem('chatdrop-theme', Theme.dark);
    }
  }
}

export default Theme;