declare module 'snipcart' {
  interface SnipcartSettings {
    publicApiKey: string

    /**
     * You can request that a specific version of Snipcart be loaded using the `version` setting. When this option is omitted, the latest version of the shopping cart is loaded.
     * You should consider specifying a version when you have a customized cart integration (such as [template customization](https://docs.snipcart.com/v3/setup/customization), [theming](https://docs.snipcart.com/v3/setup/theming), or CSS overrides). This will ensure there won’t be any breaking changes when a new cart version is released.
     */
    version?: string | null

    /**
     * By default, when the `loadStrategy` property is omitted, Snipcart will load immediately.
     * To mitigate against any performance impact, Snipcart can be loaded on first user interaction by setting the `loadStrategy` option to `"on-user-interaction"`. This will defer the initial loading of Snipcart to as soon as the user interacts with the document. If the user hasn't interacted with the page after 2,750 milliseconds, Snipcart will be loaded.
     * Setting the `loadStrategy` option to `"manual"` will allow you to load Snipcart when you want using JavaScript. A `LoadSnipcart` method will be added to the window object, which can then be called elsewhere in your code.
     */
    loadStrategy?: 'on-user-interaction' | 'manual' | null

    /**
     * The `timeoutDuration` option can be used to change the time, in milliseconds, after which the cart is loaded. This setting will only be used when `loadStrategy` is set to `"on-user-interaction"`.
     * @default 2750
     */
    timeoutDuration?: number | null

    /**
     * Setting the `loadCSS` option to `false` will omit loading the CSS assets for Snipcart. This setting is optional and will default to `true` if it is not defined in your configuration.
     * @default true
     */
    loadCSS?: boolean | null

    /**
     * This setting defines what happens when customers add products to the cart.
     * At the moment, the only supported value for this setting is `none`. When `none` is specified, customers stay on the site when a product is added; the cart does not open.
     * Any other value (or omitting this setting) will make the cart show up when a product is added.
     */
    addProductBehavior?: 'none' | null

    /**
     * You can choose between 2 different styles for the cart popup. The first is a full-page cart, and the second is only a side modal. The default style is the full-page cart.
     * To make the cart open in a side modal, you can use the `modalStyle` attribute and set the value to `side`.
     * @default 'full-page'
     */
    modalStyle?: 'full-page' | 'side' | null

    /**
     * @default 'usd'
     */
    currency?: string | null

    /**
     * @default 'cdn.snipcart.com'
     */
    domain?: string | null

    /**
     * @default 'https'
     */
    protocol?: string | null

    templatesUrl?: string | null
  }

  /**
   * Currently incomplete.
   * See https://docs.snipcart.com/v3/sdk/basics.
   */
  interface Snipcart {
    store: {
      subscribe(cb: () => void): () => void
      getState(): { cart: { items: { count: number } } }
    }
  }

  global {
    interface Window {
      SnipcartSettings: SnipcartSettings
      LoadSnipcart(): void
      Snipcart: Snipcart
    }
  }
}
