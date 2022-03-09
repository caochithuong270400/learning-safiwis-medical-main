<template>
  <v-form id="edit-form" ref="form" v-model="valid">
    <v-row>
      <v-col
        v-for="field in model.getDisplayFields(mode)"
        :key="`${field.name}`"
        cols="12"
        lg="6"
      >
        <component
          :is="getInputType(field)"
          :label="field.label"
          :value="getDisplayValue(field, value[field.name])"
          v-bind="getInputOptions(field)"
          :rules="getFieldValidationRules(field)"
          @change="onFieldChange($event, field)"
        >
        </component>
      </v-col>
    </v-row>
    <v-row> </v-row>
  </v-form>
</template>

<script>
import moment from 'moment-timezone'
export default {
  name: 'EditForm',
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
    }
  },
  computed: {},
  mounted() {
    console.log('data ', this.value)
    // console.log(this.model.getDisplayFields())
  },
  methods: {
    getInputType(field) {
      // Normalize the field type and take in account the custom display type if needed
      const inpType = field.type
      switch (inpType) {
        case 'String':
        case 'uuid':
        case 'Text':
          return 'v-text-field'
        case 'Selection':
          return 'v-select'
        case 'Date':
        case 'Datetime':
          return 'base-date-time-picker'
        default:
          return 'v-text-field'
      }
    },
    getInputOptions(field) {
      const options = {}
      switch (field.type) {
        case 'String':
        case 'uuid':
        case 'Text':
          options.outlined = true
          options.dense = true
          break
        case 'Selection':
          if (field.options) {
            options.items = field.options.map((opt) => {
              return {
                text: opt.label,
                value: opt.value,
              }
            })
          }
          break
        case 'Datetime':
          options.selectTime = true
      }
      if (this.model.canEdit(field, this.mode) === false) {
        options.disabled = true
      }
      return options
    },
    getDisplayValue(field, value) {
      switch (field.type) {
        case 'Selection':
          if (field.options) {
            for (let i = 0; i < field.options.length; i++) {
              const opt = field.options[i]
              if (opt.value === value) return opt.value
            }
          }
          break
        case 'Date':
          if (value) return moment(value).format('YYYY-MM-DD')
          else return ''
        case 'Datetime':
          if (value) return moment(value).format('YYYY-MM-DD HH:mm')
          else return ''
        default:
          return value
      }
    },
    getFieldValidationRules(field) {
      const rules = []
      if (field.validations) {
        for (const key in field.validations) {
          if (Object.hasOwnProperty.call(field.validations, key)) {
            const rule = field.validations[key]
            if (key === 'required') {
              rules.push((v) => !!v || rule)
            }
          }
        }
      }
      return rules
    },
    onPaginationChange(eventData) {
      this.$emit('change', {
        type: 'pagination',
        limit: eventData.itemsPerPage,
        offset: eventData.pageStart,
      })
    },
    toggleDeleteDialog(item, open = true) {
      this.selectedItem = item
      this.dialogDelete = open
    },
    onFieldChange(value, field) {
      this.$emit('change', { type: 'change', value, field: field.name })
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
