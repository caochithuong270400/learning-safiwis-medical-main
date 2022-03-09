<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title class="headline">{{ title }} </v-card-title>
      <v-card-text>
        {{ content }}
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="toggleDeleteDialog(null, false)"
          >Không</v-btn
        >
        <v-btn
          color="blue darken-1"
          text
          @click="deleteItemConfirm(selectedItem)"
          >Có</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => 'Thông báo',
    },
    content: {
      type: String,
      default: () => 'Thông báo',
    },
    actions: {
      type: Array,
      default: () => [{ label: 'OK', type: 'close' }],
    },
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    actionsBtn: () => {
      const btns = []
      for (let i = 0; i < this.actions.length; i++) {
        const btn = this.actions[i]
        switch (btn.type) {
          case 'close':
            btns.push({
              label: btn.label ? btn.label : 'Cancel',
              action() {
                this.show = false
              },
            })
            break
        }
      }
    },
  },
}
</script>
