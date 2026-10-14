interface Window {
  turnstile?: {
    render: (element: HTMLElement, options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
    }) => string;
    reset: (widgetId: string) => void;
  };
}
