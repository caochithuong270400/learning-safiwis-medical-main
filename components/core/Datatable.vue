<template>
  <div>
    <!-- <v-data-table
      :headers="headers"
      :items="value"
      :server-items-length="totalData"
      :items-per-page="itemsPerPage"
      :footer-props="{
        showFirstLastPage: true,
        'items-per-page-text': `SL ${model.configs.modelLabel} mỗi trang`,
      }"
      :search="search"
      @pagination="onPaginationChange"
    > -->
    <v-data-table
      :headers="headers"
      :items="value"
      :server-items-length="totalData"
      :items-per-page="itemsPerPage"
      :footer-props="{
        showFirstLastPage: true,
        'items-per-page-text': `SL ${model.configs.modelLabel} mỗi trang`,
      }"
      @pagination="onPaginationChange"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title class="blue--text">{{ title }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Tìm"
            single-line
            hide-details
            @keyup.enter="searchAll"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn outlined color="blue" class="mb-2" @click="add()">
            Thêm {{ model.getLabel() }}
          </v-btn>
        </v-toolbar>
      </template>
      <template #item="{ item, index }">
        <tr>
          <td
            v-for="field in model.getDisplayFields('list')"
            :key="`${field.name}_${index}`"
          >
            <span v-if="field.type === 'String'">{{ item[field.name] }}</span>
            <span v-else>{{ getDisplayValue(field, item[field.name]) }}</span>
          </td>
          <td v-if="actions">
            <v-icon
              v-for="act in actions"
              :key="act.name"
              small
              class="mr-2"
              @click="actionHandler(act, item)"
            >
              {{ act.icon }}
            </v-icon>
          </td>
        </tr>
      </template>
      <template slot="body.prepend">
        <tr>
          <td v-for="item in dataHeaderFilter" :key="item.name">
            <v-text-field
              v-if="
                item.filterable &&
                (item.type == 'String' ||
                  item.type == 'int' ||
                  item.type == 'enum')
              "
              v-model="item.dataFilter"
              :label="item.label"
              @keyup.enter="onFilterChange(item)"
            >
            </v-text-field>
            <v-menu
              v-if="item.filterable && item.type == 'Datetime'"
              ref="item.menu"
              v-model="item.menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="item.dataFilter"
                  :label="item.label"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="item.dataFilter"
                no-title
                @click:date="onFilterChange(item)"
                @input="item.menu = false"
              ></v-date-picker>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogDelete" width="unset">
      <v-sheet outlined color="blue" rounded>
        <v-card>
          <v-card-title class="headline blue--text"
            >{{ `Bạn có chắc muốn xoá ${model.getLabel()}: ` }}<br />
            {{
              `${selectedItem ? selectedItem[model.configs.displayKey] : ''}?`
            }}</v-card-title
          >
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
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment-timezone'
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    model: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Array,
      default: () => [],
    },
    totalData: {
      type: Number,
      default: () => -1,
    },
    itemsPerPage: {
      type: Number,
      default: () => 10,
    },
    actions: {
      type: Object,
      default: () => {
        return {
          edit: {
            name: 'edit',
            icon: 'mdi-pencil',
            type: 'edit',
          },
          delete: {
            name: 'delete',
            icon: 'mdi-delete',
            type: 'delete',
          },
        }
      },
    },
  },
  data() {
    return {
      search: '',
      test: '',
      dataHeaderFilter: [],
      tempHeader: [],
      dialogDelete: false,
      selectedItem: null,
    }
  },
  computed: {
    headers() {
      const hasActions = !!this.actions
      // return this.tempHeader
      console.log('this.model', this.model)
      return this.model.getTableHeader(hasActions)
    },
  },
  mounted() {
    // console.log('Datatbale ', this.value)
    // console.log(this.model.getDisplayFields())
  },
  created() {
    const tempTableHeader = this.model.getDisplayFields('list')
    console.log('getRelationshipFields', this.model.getRelationshipFields())
    // const tempstt = {
    //   name: 'stt',
    //   type: 'int',
    //   dataFilter: '',
    //   label: 'stt',
    //   filterable: false,
    // }
    // this.dataHeaderFilter.push(tempstt)
    for (let index = 0; index < tempTableHeader.length; index++) {
      const element = tempTableHeader[index]
      const temp = {
        name: element.name,
        type: element.type,
        dataFilter: '',
        label: element.label,
        filterable: element.filterable,
      }
      if (temp.type === 'Datetime' || temp.type === 'Date') {
        temp.menu = false
        temp.dateFormate = ''
      }
      this.dataHeaderFilter.push(temp)
    }
    // console.log('dataheaderFIlter', this.dataHeaderFilter)
    // this.tempHeader = this.addfilter(temptempHeader)
  },

  methods: {
    getDisplayValue(field, value) {
      switch (field.type) {
        case 'Selection':
          if (field.options) {
            for (let i = 0; i < field.options.length; i++) {
              const opt = field.options[i]
              if (opt.value === value) return opt.label
            }
          }
          break
        case 'Date':
          if (value) return moment(value).format('DD/MM/YYYY')
          else return ''
        case 'Datetime':
          if (value) return moment(value).format('DD/MM/YYYY HH:mm')
          else return ''
        default:
          return value
      }
    },
    // addfilter(header) {
    //   const tempDisplayField = this.model.getDisplayFields('list')
    //   for (let index = 0; index < header.length; index++) {
    //     const element = header[index]
    //     for (let index = 0; index < tempDisplayField.length; index++) {
    //       const elementDisplayField = tempDisplayField[index]
    //       if (
    //         elementDisplayField.name === element.value &&
    //         elementDisplayField.type === 'String'
    //       ) {
    //         console.log('herevalue', element)
    //         element.filter = (f) => {
    //           for (
    //             let index = 0;
    //             index < this.dataHeaderFilter.length;
    //             index++
    //           ) {
    //             const elementHeader = this.dataHeaderFilter[index]
    //             if (elementHeader.value === element.value) {
    //               console.log('filterString', elementHeader.dataFilter)
    //               return (f + '')
    //                 .toLowerCase()
    //                 .includes(elementHeader.dataFilter.toLowerCase())
    //             }
    //           }
    //         }
    //       } else if (
    //         elementDisplayField.name === element.value &&
    //         elementDisplayField.type === 'Int'
    //       ) {
    //         element.filter = (value) => {
    //           for (
    //             let index = 0;
    //             index < this.dataHeaderFilter.length;
    //             index++
    //           ) {
    //             const elementHeader = this.dataHeaderFilter[index]
    //             if (elementHeader.value === element.value) {
    //               console.log('filterInt', elementHeader)
    //               if (!elementHeader.dataFilter) return true
    //               console.log(
    //                 'filterIntreturn',
    //                 value === parseInt(elementHeader.dataFilter)
    //               )
    //               return value === parseInt(elementHeader.dataFilter)
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   console.log('dataHeaderFilter', this.dataHeaderFilter)
    //   return header
    // },
    onPaginationChange(eventData) {
      this.$emit('change', {
        type: 'pagination',
        limit: eventData.itemsPerPage,
        offset: eventData.pageStart,
      })
    },
    searchAll() {
      let queryWhere = 'where: {_or: [ '

      //  reception_time: { _gte: "${date1}", _lt: "${date2}" }}
      // ]'
      let boolCheckFilter = false
      for (let index = 0; index < this.dataHeaderFilter.length; index++) {
        const element = this.dataHeaderFilter[index]
        if (element.filterable && this.search) {
          boolCheckFilter = true
          if (element.type === 'String') {
            queryWhere =
              queryWhere + `{${element.name}: {_like: "%${this.search}%"}}`
          } else if (element.type === 'int') {
            queryWhere = queryWhere + `{${element.name}: {_eq: ${this.search}}}`
          }
          // else if (element.type === 'Datetime') {
          //   const date2 = this.search + ' ' + '23:59:59'
          //   queryWhere =
          //     queryWhere +
          //     `{${element.name}: {_gte: "${this.search}",_lte: "${date2}"}}`
          // } else if (element.type === 'Date') {
          //   queryWhere =
          //     queryWhere + `{${element.name}: {_eq: "${this.search}"}}`
          // }
        }
      }
      if (boolCheckFilter) {
        queryWhere = queryWhere + ']}'
        this.$emit('change', {
          type: 'filter',
          queryWhere,
        })
      } else {
        this.$emit('change', {
          type: 'refresh',
        })
      }
    },
    onFilterChange(item) {
      // const queryWhere = `where: {${
      //   element.value
      // }: {_like: "%c%"}} ${model.getLabel()}: `
      // const whereFilter = ''
      // this.$emit('change', {
      //   type: 'filter',
      //   queryWhere,
      // })
      if (item.dataFilter) {
        let queryWhere = ''
        if (item.type === 'String') {
          queryWhere = `where: {${item.name}: {_like: "%${item.dataFilter}%"}}`
        } else if (item.type === 'int' || item.type === 'enum') {
          queryWhere = `where: {${item.name}: {_eq: ${item.dataFilter}}}`
        } else if (item.type === 'Datetime') {
          const date2 = item.dataFilter + ' ' + '23:59:59'
          queryWhere = `where: {${item.name}: {_gte: "${item.dataFilter}",_lte: "${date2}"}}`
        } else if (item.type === 'Date') {
          queryWhere = `where: {${item.name}: {_eq: "${item.dataFilter}"}}`
        }
        this.$emit('change', {
          type: 'filter',
          queryWhere,
        })
      } else {
        this.$emit('change', {
          type: 'refresh',
        })
      }
    },
    actionHandler(action, item) {
      switch (action.type) {
        case 'edit':
          this.$router.push({
            path: `/edit/${this.model.getModelName()}`,
            query: { id: item[this.model.key.name] },
          })
          break
        case 'delete':
          this.toggleDeleteDialog(item)
          break
      }
    },
    toggleDeleteDialog(item, open = true) {
      this.selectedItem = item
      this.dialogDelete = open
    },
    parseDate(date, type) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      if (
        day === undefined ||
        month === undefined ||
        year === undefined ||
        month > '12' ||
        day > '31' ||
        ((month === '4' ||
          month === '6' ||
          month === '9' ||
          month === '04' ||
          month === '06' ||
          month === '09' ||
          month === '11') &&
          day > '30') ||
        ((month === '02' || month === '2') && day > '29')
      ) {
        this.textSnackbar = 'Nhập ngày ko đúng định dạng'
        this.snackbar = true
        return ''
      }
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    deleteItemConfirm(item) {
      this.$emit('change', {
        type: 'delete',
        item,
      })
      this.dialogDelete = false
      this.selectedItem = null
    },
  },
}
</script>
<style lang="scss">
#no-background-hover::before {
  background-color: transparent !important;
}
</style>
