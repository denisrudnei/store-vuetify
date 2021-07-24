<template>
  <v-row>
    <v-col cols="12">
      <v-card tile elevation="0">
        <v-card-text>
          <v-breadcrumbs :items="breadcrumbs">
            <template #item="{ item }">
              <v-breadcrumbs-item>
                <v-btn :to="item.href" tile text>
                  {{ item.text }}
                </v-btn>
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <span :class="!isMobile ? 'display-3' : 'title'">
        {{ product.name }}
      </span>
    </v-col>
    <v-col cols="12" md="4">
      <v-row>
        <v-col cols="12">
          <v-carousel>
            <v-carousel-item
              v-for="image in images"
              :key="image"
              :src="'/images/not-set.svg'"
            />
          </v-carousel>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="quantity"
            v-mask="['##', '#,###']"
            :prepend-icon="icons.mdiMinus"
            :append-outer-icon="icons.mdiPlus"
            outlined
            type="tel"
            @click:prepend="remove"
            @click:append-outer="add"
          />
        </v-col>
        <v-col cols="12">
          <span class="title">Price: $ {{ product.price }}</span>
        </v-col>
        <v-col cols="12">
          <v-btn block tile @click="addToCart(product)">
            <v-icon left>{{ icons.mdiCart }}</v-icon>
            Add to cart
          </v-btn>
        </v-col>
        <v-col cols="12">
          <rating />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="8">
      <v-row>
        <v-col id="description" cols="12">
          <span v-html="product.description" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { TheMask } from 'vue-the-mask'
import slugify from 'slugify'
import { mdiCart, mdiPlus, mdiMinus } from '@mdi/js'
import Rating from '~/components/rating.vue'
import productPage from '~/mixins/product-page'
import theme from '~/mixins/theme'
export default {
  auth: false,
  directives: {
    TheMask,
  },
  components: {
    Rating,
  },
  mixins: [productPage, theme],
  props: {
    product: {
      type: Object,
      default: () => ({
        price: 0,
        name: '',
      }),
    },
  },
  data() {
    return {
      icons: {
        mdiCart,
        mdiPlus,
        mdiMinus,
      },
      images: Array.from({ length: 5 }, (_, x) => (x += 1)),
      quantity: 1,
    }
  },
  jsonld() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: this.product.name,
      description: this.product.ogDescription,
      image: Array.from({ length: 5 }, (_, i) => (i += 1)).map(
        () => '/images/not-set.svg'
      ),
      offers: {
        '@type': 'Offer',
        price: this.product.price.toFixed(2),
        priceCurrency: 'BRL',
      },
      review: this.product.rating
        ? {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '0',
              bestRating: '5',
            },
            author: {
              '@type': 'Person',
              name: '',
            },
          }
        : undefined,
      aggregateRating: this.product.rating
        ? {
            '@type': 'AggregateRating',
            ratingValue: '0',
            reviewCount: 0,
          }
        : undefined,
    }
  },
  computed: {
    breadcrumbs() {
      if (!this.product.category) return []
      return this.product.category.fullName.split('|slash|').map((item) => {
        const link = slugify(item, {
          replacement: '-',
          lower: true,
        })
        return {
          text: item,
          href: `/categories/${link}`,
        }
      })
    },
  },
  watch: {
    quantity(value) {
      const parsed =
        typeof value === 'number'
          ? value
          : parseFloat(value.replaceAll(',', '.'), 10)
      if (value === '' || parsed <= 0) {
        this.quantity = '0,000'
      }
    },
  },
  methods: {
    addToCart(product) {
      this.$store.commit('products/addToCart', product)
    },
    add() {
      this.quantity = (
        parseFloat(this.quantity.toString().replaceAll(',', '.'), 10) + 0.1
      )
        .toFixed(3)
        .toString()
        .replaceAll('.', ',')
    },
    remove() {
      if (this.quantity === 0) return
      this.quantity = (
        parseFloat(this.quantity.toString().replaceAll(',', '.')) - 0.1
      )
        .toFixed(3)
        .toString()
        .replaceAll('.', ',')
    },
  },
}
</script>

<style>
#description figure {
  display: flex;
  width: 100%;
}

#description figure > img {
  vertical-align: middle;
  align-self: center;
  margin: 5px auto;
}

#description table {
  border-collapse: collapse;
  margin: 5px auto;
}

#description th,
#description td,
#description tr {
  padding: 5px;
  border: 2px solid #6b6b6b;
}
</style>
