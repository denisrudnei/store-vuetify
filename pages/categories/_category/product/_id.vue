<template>
  <v-row>
    <v-col cols="12">
      <span class="display-3">
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
              :src="`https://picsum.photos/800/600/?${Math.random()}`"
            />
          </v-carousel>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="quantity"
            v-mask="['##', '#,###']"
            prepend-icon="mdi-minus"
            append-outer-icon="mdi-plus"
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
            <v-icon left>mdi-cart</v-icon>
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
        <v-col cols="12">
          <span>
            {{ product.description }}
          </span>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { TheMask } from 'vue-the-mask'
import { GetProduct } from '../../../../graphql/query/product/GetProduct'
import Rating from '~/components/rating.vue'
export default {
  directives: {
    TheMask,
  },
  data() {
    return {
      images: Array.from({ length: 5 }, (_, x) => (x += 1)),
      product: {
        price: 0,
        name: '',
      },
      quantity: 1,
    }
  },
  head() {
    return {
      title: this.product.name,
      meta: [
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://picsum.photos/800/600/',
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'product',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.product.name,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.product.description,
        },
        {
          hid: 'og:ammount',
          property: 'og:ammount',
          content: this.product.price,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `product/${this.product.id}`,
        },
      ],
    }
  },
  computed: {
    Rating,
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
  created() {
    this.$apollo
      .query({
        query: GetProduct,
        variables: {
          id: this.$route.params.id,
        },
      })
      .then((response) => {
        this.product = response.data.GetProduct
      })
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

<style></style>
