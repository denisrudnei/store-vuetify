import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      settings: 'site-settings/getSiteSettings',
    }),
    image() {
      if (this.product.images && this.product.images.length)
        return this.product.images[0]
      return '/images/not-set.svg'
    },
  },
  head() {
    return {
      title: `${this.product.name} - ${this.settings.name}`,
      link: [
        {
          rel: 'canonical',
          href: `${process.env.SITEMAP_BASE}product/${this.product.id}`,
        },
      ],
      meta: [
        {
          hid: 'description',
          property: 'description',
          content: this.product.ogDescription,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.image,
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'og:product',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.product.name,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.product.ogDescription,
        },
        {
          hid: 'product:price:amount',
          property: 'product:price:amount',
          content: this.product.price.toFixed(2),
        },
        {
          hid: 'product:price:currency',
          property: 'product:price:currency',
          content: 'BRL',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `product/${this.product.id}`,
        },
      ],
    }
  },
}
