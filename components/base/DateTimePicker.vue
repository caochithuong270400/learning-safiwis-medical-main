<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
    :disabled="disabled"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        :value="getDisplayValue()"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        :disabled="disabled"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" no-title scrollable> </v-date-picker>
    <v-time-picker v-if="selectTime" v-model="time"></v-time-picker>
  </v-menu>
</template>
<script>
import moment from 'moment-timezone'
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: null,
      default: null,
    },
    selectTime: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    date: '',
    time: '',
    menu: false,
  }),
  methods: {
    getDisplayValue() {
      const date = this.date ? this.date : this.value
      if (date) {
        return moment(date).format('DD/MM/YYYY') + ' ' + this.time
      }
    },
  },
}
</script>
