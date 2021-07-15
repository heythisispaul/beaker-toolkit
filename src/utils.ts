export const EXPERIMENT_CONSENT = 'BEAKER_EXPERIMENT_CONSENT';
export const OPT_OUT = 'BEAKER_OPTED_OUT';

export const getParsedCookies = (cookieString?: string) => {
  const determinedString = cookieString || (typeof document !== 'undefined' && document.cookie);

  if (determinedString) {
    const crumbs = determinedString.split(';');
    const parsed = crumbs.reduce((allParsed, crumb) => {
      const [name, value] = crumb.split('=');
      allParsed[name] = value;
      return allParsed;
    }, {} as Record<string, string>);

    return parsed;
  }

  return {};
};

export const hasExperimentConsent = () => {
  const cookies = getParsedCookies();
  return cookies[EXPERIMENT_CONSENT] && cookies[EXPERIMENT_CONSENT] !== OPT_OUT;
};

export const writeCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}`;
};
