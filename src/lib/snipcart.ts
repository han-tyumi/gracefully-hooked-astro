import { kebabCase } from 'lodash'
import { JsonObject, JsonPrimitive, KebabCase, ValueOf } from 'type-fest'

export const CountStorageKey = 'gh-cart-count'

export type CustomParam<Suffix extends string> = `custom${number}-${Suffix}`

export type DropdownOption =
  | string
  | {
      name: string
      price?: number | null
    }

export interface ProductParams {
  name: string
  id: string
  price: number
  url?: string | null
  description?: string | null
  image?: string | null
  categories?: string[] | null
  metadata?: JsonObject | null
  weight?: number | null
  length?: number | null
  height?: number | null
  width?: number | null
  quantity?: number | null
  maxQuantity?: number | null
  minQuantity?: number | null
  stackable?: 'auto' | 'never' | 'always' | null
  quantityStep?: number | null
  shippable?: boolean | null
  taxable?: boolean | null
  taxes?: string[] | null
  hasTaxesIncluded?: boolean | null
  fileGuid?: string | null
  [Key: CustomParam<'name' | 'placeholder'>]: string
  [Key: CustomParam<'options'>]: DropdownOption[]
  [Key: CustomParam<'type'>]: 'checkbox' | 'textarea' | 'readonly' | 'hidden'
  [Key: CustomParam<'value'>]: JsonPrimitive
  [Key: CustomParam<'required'>]: true
  [Key: `price-${string}`]: number
}

type CustomProductParams = {
  [Property in keyof ProductParams as Property extends CustomParam<infer Suffix>
    ? Suffix
    : never]: ProductParams[Property]
}

export type ProductAttributes = {
  [Property in keyof ProductParams as `data-item-${KebabCase<Property>}`]: string
}

export interface DropdownParams {
  value?: string | null
  required?: true | null
  placeholder?: string | null
}

export interface TextBoxParams {
  value?: string | null
  required?: true | null
  placeholder?: string | null
}

export interface CheckboxParams {
  checkedPriceAdjustment?: number | null
  uncheckedPriceAdjustment?: number | null
  value?: boolean | null
  required?: true | null
}

export interface TextareaParams {
  value?: string | null
  required?: true | null
  placeholder?: string | null
}

export class ProductFactory {
  static New(params: ProductParams) {
    return new ProductFactory(params)
  }

  private customId = 1
  private attributes: ProductAttributes = {
    'data-item-name': '',
    'data-item-id': '',
    'data-item-price': '',
  }

  constructor(params: ProductParams) {
    this.setAttributes(params)
  }

  private useSetCustomAttribute() {
    const prefix = `custom${this.customId++}-` as const
    return <Suffix extends keyof CustomProductParams>(
      name: Suffix,
      value: ProductParams[`${typeof prefix}${Suffix}`]
    ) => this.setAttribute(`${prefix}${name}`, value)
  }

  setAttribute<Name extends keyof ProductParams>(
    name: Name,
    value: ProductParams[Name]
  ) {
    if (value == null) {
      return this
    }

    const kebabName = kebabCase(name) as KebabCase<Name>
    this.attributes[`data-item-${kebabName}`] = (() => {
      if (typeof value === 'string') {
        return value
      }

      if (!Array.isArray(value)) {
        return JSON.stringify(value)
      }

      return value
        .map((option) => {
          if (typeof option === 'string') {
            return option
          }
          const { name, price } = option
          return `${name}${price ? `[${price < 0 ? '' : '+'}${price}]` : ''}`
        })
        .join('|')
    })()

    return this
  }

  setAttributes(params: ProductParams) {
    for (const entry of Object.entries(params)) {
      const [key, value] = entry as [
        keyof typeof params,
        ValueOf<typeof params>
      ]
      this.setAttribute(key, value)
    }

    return this
  }

  dropdown(
    name: string,
    options: DropdownOption[],
    params: DropdownParams = {}
  ) {
    const setCustomAttribute = this.useSetCustomAttribute()

    setCustomAttribute('name', name)
    setCustomAttribute('options', options)

    const { value, required, placeholder } = params

    if (value != null) {
      setCustomAttribute('value', value)
    }

    if (required != null) {
      setCustomAttribute('required', required)
    }

    if (placeholder != null) {
      setCustomAttribute('placeholder', placeholder)
    }

    return this
  }

  textBox(name: string, params: TextBoxParams = {}) {
    const setCustomAttribute = this.useSetCustomAttribute()

    setCustomAttribute('name', name)

    const { value, required, placeholder } = params

    if (value != null) {
      setCustomAttribute('value', value)
    }

    if (required != null) {
      setCustomAttribute('required', required)
    }

    if (placeholder != null) {
      setCustomAttribute('placeholder', placeholder)
    }

    return this
  }

  checkbox(name: string, params: CheckboxParams = {}) {
    const setCustomAttribute = this.useSetCustomAttribute()

    setCustomAttribute('name', name)
    setCustomAttribute('type', 'checkbox')

    const {
      checkedPriceAdjustment: checkedPrice,
      uncheckedPriceAdjustment: uncheckedPrice,
      value,
      required,
    } = params

    if (checkedPrice != null || uncheckedPrice != null) {
      setCustomAttribute('options', [
        { name: 'true', price: checkedPrice },
        { name: 'false', price: uncheckedPrice },
      ])
    }

    if (value != null) {
      setCustomAttribute('value', value)
    }

    if (required != null) {
      setCustomAttribute('required', required)
    }

    return this
  }

  textarea(name: string, params: TextareaParams = {}) {
    const setCustomAttribute = this.useSetCustomAttribute()

    setCustomAttribute('name', name)
    setCustomAttribute('type', 'textarea')

    const { value, required, placeholder } = params

    if (value != null) {
      setCustomAttribute('value', value)
    }

    if (required != null) {
      setCustomAttribute('required', required)
    }

    if (placeholder != null) {
      setCustomAttribute('placeholder', placeholder)
    }

    return this
  }

  readonly(name: string, value: string, options?: DropdownOption[]) {
    const setCustomAttribute = this.useSetCustomAttribute()

    setCustomAttribute('name', name)
    setCustomAttribute('type', 'readonly')
    setCustomAttribute('value', value)

    if (options) {
      setCustomAttribute('options', options)
    }

    return this
  }

  hidden(name: string, value: string, options?: DropdownOption[]) {
    const setCustomAttribute = this.useSetCustomAttribute()

    setCustomAttribute('name', name)
    setCustomAttribute('type', 'hidden')
    setCustomAttribute('value', value)

    if (options) {
      setCustomAttribute('options', options)
    }

    return this
  }

  alternatePrice(priceList: string, price: number) {
    return this.setAttribute(`price-${priceList}`, price)
  }

  getAttributes() {
    return this.attributes
  }
}
