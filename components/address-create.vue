<template>
  <v-card>
    <v-card-title></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="address.zipCode"
            outlined
            label="Zip code"
            @change="getZip"
          />
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field v-model="address.country" outlined label="Country">
          </v-text-field>
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field v-model="address.city" outlined label="City" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="address.number" outlined label="Number" />
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field v-model="address.street" outlined label="Street" />
        </v-col>
        <v-col md="6" cols="12">
          <v-text-field v-model="address.district" outlined label="District" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="address.state" outlined label="State" />
        </v-col>
        <v-col>
          <v-btn class="primary white--text" @click="add">
            {{ value.id ? 'Update' : 'Save' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        zipCode: '',
        country: '',
        city: '',
        number: '',
        street: '',
        district: '',
        state: '',
      }),
    },
  },
  data() {
    return {
      addressData: {
        zipCode: '',
        country: '',
        city: '',
        number: '',
        street: '',
        district: '',
        state: '',
      },
    }
  },
  computed: {
    address() {
      return Object.assign(this.addressData, this.value)
    },
  },
  methods: {
    add() {
      this.$emit(this.value.id ? 'update' : 'save', this.address)
    },
    getZip(zipCode) {
      this.$axios
        .post('/zipcode', {
          zipCode,
        })
        .then((response) => {
          const { localidade, logradouro, bairro, uf } = response.data
          this.address.city = localidade
          this.address.street = logradouro
          this.address.district = bairro
          this.address.state = uf
        })
    },
  },
}
</script>

<style></style>
