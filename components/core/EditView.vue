<template>
  <div>
    <v-toolbar flat>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="backToList()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span> {{ `Quay lại danh sách ${model.getLabel()}` }}</span>
      </v-tooltip>

      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="primary" @click="save()">
        <v-icon color="white" left>mdi-content-save</v-icon>
        Lưu
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
    </v-toolbar>
    <edit-form
      v-if="model"
      v-model="editData"
      :title="`Chỉnh sửa ${model.configs.modelLabel} ${
        value[model.configs.displayKey] ? value[model.configs.displayKey] : ''
      }`"
      :model="model"
      mode="edit"
      @change="eventHandlers"
    ></edit-form>
  </div>
</template>

<script>
import EditForm from '~/components/core/EditForm'
export default {
  name: 'EditVue',
  components: { EditForm },
  props: {
    title: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'add',
    },
    model: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Object,
      default: () => {},
    },
    actions: {
      type: Object,
      default: () => {
        return {
          edit: {
            type: 'edit',
          },
          delete: {
            type: 'delete',
          },
        }
      },
    },
  },
  data() {
    return {
      search: '',
      dialogDelete: false,
      selectedItem: null,
      valid: true,
      editData: null,
    }
  },
  computed: {},
  mounted() {
    this.editData = this.$store.state.data.editData
    console.log(this.editData)
    // console.log('Datatbale ', this.value)
    // console.log(this.model.getDisplayFields())
  },
  methods: {
    eventHandlers(eventData) {
      switch (eventData.type) {
        case 'save': {
          const updateData = this.model.processUpdateData(this.modelData)
          const mutationQuery = this.model.getQuery('update')
          const variables = {
            where_key: this.modelData[this.model.key.name],
            data_update: updateData,
          }

          this.$apollo
            .mutate({
              mutation: mutationQuery,
              variables,
            })
            .then((res) => {
              if (res.data[Object.keys(res.data)[0]].affected_rows > 0) {
                this.$toast.success(
                  `Đã cập nhật ${this.model.getLabel()} ${
                    eventData.item[this.model.configs.displayKey]
                  } thành công`,
                  { duration: 5000 }
                )
                this.$apollo.queries.tableData.refresh()
              } else {
                this.$toast.error(
                  `Cập nhật ${this.model.getLabel()} ${
                    eventData.item[this.model.configs.displayKey]
                  } thất bại`
                )
              }
            })
          break
        }
        case 'change':
          this.modelData[eventData.field] = eventData.value
          break
      }
    },
    save() {
      this.$emit('change', { type: 'save' })
    },
    deleteItemConfirm(item) {
      this.$emit('change', {
        type: 'delete',
        item,
      })
      this.dialogDelete = false
      this.selectedItem = null
    },
    backToList() {
      this.$router.push(`/list/${this.model.getModelName()}`)
    },
  },
}
</script>
