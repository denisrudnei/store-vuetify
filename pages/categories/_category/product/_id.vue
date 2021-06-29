<template>
  <v-row>
    <v-col cols="12">
      <span class="title">
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
          <span class="title">Price: $ {{ product.price }}</span>
        </v-col>
        <v-col cols="12">
          <v-btn block tile @click="addToCart(product)">
            <v-icon left>mdi-cart</v-icon>
            Add to cart
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="8">
      <v-row>
        <v-col cols="12">
          <v-rating length="5" :value="4.5" half-increments readonly />
        </v-col>
        <v-col cols="12">
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel quam
            elementum pulvinar etiam non quam lacus suspendisse. Morbi enim nunc
            faucibus a pellentesque sit amet porttitor eget. Nunc mi ipsum
            faucibus vitae aliquet nec ullamcorper sit. Vitae justo eget magna
            fermentum iaculis. In pellentesque massa placerat duis. Elit ut
            aliquam purus sit amet luctus venenatis. Nibh ipsum consequat nisl
            vel pretium lectus quam id leo. Mattis rhoncus urna neque viverra
            justo nec ultrices dui sapien. Mi tempus imperdiet nulla malesuada
            pellentesque elit eget gravida cum. Nibh mauris cursus mattis
            molestie. Sollicitudin tempor id eu nisl nunc mi ipsum faucibus
            vitae. Ac turpis egestas sed tempus urna et pharetra. Feugiat
            scelerisque varius morbi enim nunc. Magna sit amet purus gravida
            quis blandit turpis. Et netus et malesuada fames. Consectetur a erat
            nam at. Nulla aliquet enim tortor at auctor urna nunc id cursus.
            Ultricies mi quis hendrerit dolor magna eget est. Maecenas accumsan
            lacus vel facilisis volutpat. Ut tortor pretium viverra suspendisse
            potenti nullam ac. Morbi tristique senectus et netus. Neque
            convallis a cras semper auctor. Sit amet justo donec enim diam.
            Volutpat consequat mauris nunc congue nisi vitae suscipit tellus
            mauris. Consectetur libero id faucibus nisl tincidunt eget. Ut sem
            viverra aliquet eget sit. Viverra adipiscing at in tellus integer.
            Erat nam at lectus urna. Ipsum dolor sit amet consectetur adipiscing
            elit. Proin libero nunc consequat interdum varius. Pellentesque
            massa placerat duis ultricies. Etiam non quam lacus suspendisse.
            Fringilla ut morbi tincidunt augue interdum velit euismod in
            pellentesque. Ridiculus mus mauris vitae ultricies. Nunc scelerisque
            viverra mauris in aliquam sem. Interdum consectetur libero id
            faucibus nisl tincidunt eget nullam. Turpis in eu mi bibendum neque
            egestas congue. Pellentesque nec nam aliquam sem et tortor. Aliquet
            nibh praesent tristique magna sit. Blandit cursus risus at ultrices
            mi tempus imperdiet nulla malesuada. Turpis massa tincidunt dui ut
            ornare lectus sit amet. Viverra justo nec ultrices dui sapien.
            Tristique senectus et netus et malesuada fames ac turpis egestas.
            Nunc eget lorem dolor sed. Est velit egestas dui id. Aliquet
            porttitor lacus luctus accumsan tortor. A scelerisque purus semper
            eget duis at tellus at. Sagittis nisl rhoncus mattis rhoncus. Semper
            risus in hendrerit gravida rutrum quisque non tellus. Eu tincidunt
            tortor aliquam nulla. Ullamcorper dignissim cras tincidunt lobortis
            feugiat. Ac auctor augue mauris augue neque gravida in fermentum et.
            Ultrices in iaculis nunc sed augue. Hendrerit gravida rutrum quisque
            non tellus orci ac auctor. Aliquam vestibulum morbi blandit cursus
            risus at ultrices mi. Ultricies lacus sed turpis tincidunt id
            aliquet risus feugiat in. Rhoncus est pellentesque elit ullamcorper
            dignissim. Eu sem integer vitae justo eget magna. Eget mi proin sed
            libero enim sed. Ultrices vitae auctor eu augue ut. Morbi tristique
            senectus et netus. Blandit volutpat maecenas volutpat blandit
            aliquam etiam erat velit scelerisque.
          </span>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import faker from 'faker'
export default {
  data() {
    return {
      images: Array.from({ length: 5 }, (_, x) => (x += 1)),
      product: {
        price: 0,
        name: '',
      },
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
      ],
    }
  },
  created() {
    this.product.price = faker.commerce.price()
    this.product.name = faker.commerce.productName()
  },
  methods: {
    addToCart(product) {
      this.$store.commit('products/addToCart', product)
    },
  },
}
</script>

<style></style>
