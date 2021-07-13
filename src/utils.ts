export const EXPERIMENT_CONSENT = 'EXPERIMENT_CONSENT';

export const getParsedCookies = () => {
  if (document && document.cookie) {

    const crumbs = document.cookie.split(';');
    const parsed = crumbs.reduce((allParsed, crumb) => {
      const [name, value] = crumb.split('=');
      allParsed[name] = value;
      return allParsed;
    }, {} as Record<string, string>);

    return parsed;
  }

  return {};
};

export const writeCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}`;
};
