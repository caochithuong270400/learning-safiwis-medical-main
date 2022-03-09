import moment from 'moment-timezone'
import stripHtml from 'string-strip-html'
import queryBuilder from './QueryBuilder'

const defaultConfigs = {
  modelName: '',
  modelLabel: '',
  tableName: '',
  editable: true,
  displayKey: '',
  defaultSort: { key: 'id', direction: 'asc' },
}

export default class BaseModel {
  constructor({ configs, fields, functions }) {
    this.configs = Object.assign({}, defaultConfigs, configs)
    this.fields = fields
    this.functions = functions
    this.arrayFieldName = []
    this.arrayField = []
    this.displayFields = {
      list: [],
      view: [],
      add: [],
      edit: [],
    }
    this.displayTableHeader = []
    this.filterHeader = []
    this.customDisplayFields = {
      list: [],
      view: [],
      add: [],
      edit: [],
    }
    this.fieldGroups = {
      add: {},
      edit: {},
    }
    this.arrayRelFields = []
    this.arrayRelFieldsName = []
    this.arrayRelManyFields = []
    this.arrayRelManyFieldsName = []
    this.arrayFieldComputed = []
    this.arrayShadowRelationships = []
    this.arrayShadowFields = []
    this.arrayAggregateField = []
    this.newOject = {}

    for (const key in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        const field = fields[key]
        field.key = key
        if (field.primaryKey === true) {
          this.key = field
        }
        this.newOject[key] = field.default_value ? field.default_value : null
        if (field.type === 'Relationship') {
          if (field.relType === 'many') {
            this.arrayRelManyFields.push(field)
            this.arrayRelManyFieldsName.push(field.name)
          } else {
            this.arrayRelFields.push(field)
            this.arrayRelFieldsName.push(field.name)
          }
        } else if (field.type === 'Computed') {
          this.arrayFieldComputed.push(field)
        } else if (field.type === 'ShadowRelationship') {
          this.arrayShadowRelationships.push(field)
        } else if (field.type === 'ShadowSelection') {
          this.arrayShadowFields.push(field)
          if (field.computed) {
            this.arrayFieldComputed.push(field)
          }
        } else if (field.type === 'ShadowField') {
          this.arrayShadowFields.push(field)
        } else if (field.type === 'aggregate') {
          this.arrayAggregateField.push(field)
        } else {
          this.arrayFieldName.push(field.name)
          this.arrayField.push(field)
        }

        if (field.display && field.display.list === false) {
          // do nothing
        } else if (field.display?.list?.mode === 'expansion') {
          this.customDisplayFields.list.push(field)
        } else {
          this.displayFields.list.push(field)
          this.displayTableHeader.push({
            text: field.label,
            align: 'start',
            sortable: field.sortable,
            value: field.name,
            class: 'blue lighten-2 font-weight-medium text-h4 white--text',
            filterable: field.filterable,
            // filter: (f) => {
            //   return (f + '')
            //     .toLowerCase()
            //     .includes(this['field.name'].toLowerCase())
            // },
          })
        }

        if (field.display && field.display.view === false) {
          // do nothing
        } else {
          this.displayFields.view.push(field)
        }

        if (field.display && field.display.add === false) {
          // do nothing
        } else if (field.display?.add?.mode === 'group') {
          if (this.fieldGroups.add[field.display.add.group]) {
            this.fieldGroups.add[field.display.add.group].fieldList.push(field)
          } else {
            this.fieldGroups.add[field.display.add.group] = {
              key: field.display.add.group,
              label: field.display.add.label,
              mode: 'group',
              fieldList: [field],
              validations: field.validations,
              ordinal: field.ordinal,
              display: field.display,
            }
            this.displayFields.add.push(
              this.fieldGroups.add[field.display.add.group]
            )
          }
        } else {
          this.displayFields.add.push(field)
        }

        if (field.display && field.display.edit === false) {
          // do nothing
        } else if (field.display?.edit?.mode === 'group') {
          if (this.fieldGroups.edit[field.display.edit.group]) {
            this.fieldGroups.edit[field.display.edit.group].fieldList.push(
              field
            )
          } else {
            this.fieldGroups.edit[field.display.edit.group] = {
              key: field.display.edit.group,
              label: field.display.edit.label,
              mode: 'group',
              fieldList: [field],
              validations: field.validations,
              ordinal: field.ordinal,
              display: field.display,
            }
            this.displayFields.edit.push(
              this.fieldGroups.edit[field.display.edit.group]
            )
          }
        } else {
          this.displayFields.edit.push(field)
        }
      }
    }
  }

  getModelName() {
    return this.configs.modelName
  }

  getLabel() {
    return this.configs.modelLabel
  }

  getTableName() {
    return this.configs.tableName
  }

  getNewObject() {
    return Object.assign({}, this.newOject)
  }

  getTableHeader(hasActions = false) {
    const header = [...this.displayTableHeader]
    // header.unshift({
    //   text: 'STT',
    //   value: 'stt',
    //   sortable: false,
    //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
    // })
    if (hasActions)
      header.push({
        text: 'Hành động',
        value: 'actions',
        sortable: false,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      })
    return header
  }

  getDisplayType(type = 'form') {
    // console.log("Display type", this, type)
    if (this.display && this.display[type]) {
      return this.display[type].mode
    }
  }

  getDisplayHeader(type = 'header') {
    if (this.display && this.display[type]) {
      if (
        type !== 'header' &&
        this.display[type] &&
        this.display[type].header
      ) {
        return this.display[type].header
      }
      return this.display[type].mode
    }
    return null
  }

  getHeaderCustom(type = 'header') {
    if (this.display && this.display[type] && this.display[type].show) {
      return this.display[type].show
    }
  }

  getHeaderHtml(type = 'header') {
    if (this.display && this.display[type] && this.display[type].html) {
      return this.display[type].html
    }
  }

  getTabList(type = 'form', mode = 'add') {
    if (this.display && this.display[type]?.mode === 'tab') {
      const lstResult = []
      const tabList = this.display[type].tabList
      // console.log(type,mode, this.display[type].tabList)
      for (let i = 0; i < tabList.length; i++) {
        const tab = tabList[i]
        if (tab.display && tab.display[mode] === false) {
          // do nothing
        } else {
          lstResult.push(tab)
        }
      }
      return lstResult
    }
  }

  getContent(type = 'header') {
    if (
      this.display &&
      (this.display[type]?.mode === 'header' ||
        this.display[type]?.mode === 'custom')
    ) {
      return this.display[type].content
    }
  }

  getFunction(type) {
    if (type === 'BeforeSubmit') {
      if (this.functions) {
        return this.functions.onBeforeSubmit
      }
    }
    if (type === 'AfterSubmit') {
      if (this.functions) {
        return this.functions.onAfterSubmit
      }
    }
    return null
  }

  getDisplayFields(type = 'list') {
    return this.displayFields[type]
  }

  getCustomSort(mode = 'list') {
    if (this.custom_sort && this.custom_sort[mode]) {
      return this.custom_sort[mode]
    }
  }

  getCustomDisplayFields(type = 'list') {
    if (this.customDisplayFields[type].length > 0)
      return this.customDisplayFields[type][0]
    return null
  }

  getFieldList() {
    return this.arrayFieldName
  }

  getRelationship(relationshipName) {
    if (!this.fields[relationshipName]) {
      return {}
    } else {
      return this.fields[relationshipName].ref
    }
  }

  hasOptions() {
    if (this.arrayRelFields.length > 0) {
      return true
    }
    return false
  }

  hasManyRelationship() {
    if (this.arrayRelManyFields.length > 0) {
      for (let i = 0; i < this.arrayRelManyFields.length; i++) {
        const rmf = this.arrayRelManyFields[i]
        if (rmf.display?.showedit && rmf.display?.showedit === true) {
          return this.arrayRelManyFields[0]
        } else if (rmf.display?.add === false || rmf.display?.edit === false) {
          continue
        } else {
          return this.arrayRelManyFields[0]
        }
      }
    }
    return null
  }

  getShadowRelationshipsFields() {
    return this.arrayShadowRelationships
  }

  getRelationshipFields() {
    return this.arrayRelFields
  }

  getRelationshipFieldList() {
    return this.arrayRelFieldsName
  }

  getAggregateFieldList() {
    return this.arrayAggregateField
  }

  getField(fieldName) {
    const field = this.fields[fieldName]
    if (field) {
      if (!field.label) {
        field.label = fieldName
      }
    }
    return field
  }

  processData(data, inputConditions = null, parentData) {
    for (let j = 0; j < data.length; j++) {
      const row = data[j]
      for (let i = 0; i < this.arrayField.length; i++) {
        const field = this.arrayField[i]
        if (field.type === 'Date') {
          if (row[field.key]) {
            row[field.key] = moment
              .utc(row[field.key])
              .clone()
              .tz('Asia/Ho_Chi_Minh')
              .toDate()
          }
        }
      }
      for (let i = 0; i < this.arrayFieldComputed.length; i++) {
        const comfield = this.arrayFieldComputed[i]
        comfield.computed(row, j, inputConditions, parentData)
      }
      for (let i = 0; i < this.arrayRelFields.length; i++) {
        const relField = this.arrayRelFields[i]
        if (relField.isHtml === true) {
          if (row[relField.name]) {
            const notHtml = stripHtml(row[relField.name].name)
            row[relField.name].name = notHtml.result
          }
        }
      }
      for (let i = 0; i < this.arrayAggregateField.length; i++) {
        const agfield = this.arrayAggregateField[i]
        switch (agfield.function) {
          case 'count':
            if (row[agfield.key] && row[agfield.key].aggregate) {
              const count = row[agfield.key].aggregate.count
              row[agfield.key] = count
            }
            break
          case 'sum':
            if (row[agfield.key] && row[agfield.key].aggregate) {
              const sum = row[agfield.key].aggregate.sum[agfield.column]
              row[agfield.key] = sum
            }
            break
        }
      }
    }
  }

  canEdit(field, mode = 'add') {
    if (field.edit && field.edit[mode] === false) {
      return false
    } else {
      return true
    }
  }

  /**
   * Process update data
   */
  processUpdateData(data) {
    const processed = Object.assign({}, data)
    delete processed.__typename
    return processed
  }

  /**
   * Query helper
   */
  getQuery(type, options, filterWhere) {
    console.log('getquery', this)
    switch (type) {
      case 'list':
        return queryBuilder.getListQuery(this, options)
      case 'list_where':
        return queryBuilder.getListQuery(this, options, filterWhere)
      case 'delete':
        return queryBuilder.deleteDataQuery(this, options)
      case 'single':
        return queryBuilder.getByIdQuery(this, options)
      case 'update':
        return queryBuilder.updateDataQuery(this, options)
    }
  }
}
