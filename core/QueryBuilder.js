import gql from 'graphql-tag'
export default {
  getTablesQuery(listModel) {
    let modelQuery = []
    for (let i = 0; i < listModel.length; i++) {
      const m = listModel[i]
      modelQuery = [...modelQuery, m.tableName, '{', ...m.getFieldList(), '}']
    }

    return modelQuery
  },

  /**
   * Get return fields of the model
   *
   *
   * */
  getReturnFields(model, relationships) {
    let relationshipReturnFields = []
    let relationshipFields = []
    let aggregateFields = []
    const whereRels = ''

    if (relationships && relationships.length > 0) {
      for (let i = 0; i < relationships.length; i++) {
        const e = relationships[i]
        const relModel = model.getRelationship(e)
        const relField = model.getField(e)
        console.log('relModel', e)
        console.log('relField', relField)
        let selectFields = []

        if (relField.relType == null || relField.relType !== 'many') {
          relationshipFields = [
            ...relationshipFields,
            `${relField.key} : ${relModel.tableName}`,
            '{',
            ...relModel.getFieldList(),
          ]

          // console.log("REL FIELDs", relationshipFields)
          if (relField.fetch_relationships) {
            selectFields = [e, '{', ...relModel.getFieldList()]
            for (let j = 0; j < relField.fetch_relationships.length; j++) {
              const f = relField.fetch_relationships[j]
              const subRelModel = relModel.getRelationship(f)
              relationshipFields = [
                ...relationshipFields,
                `${f}`,
                '{',
                ...subRelModel.getFieldList(),
                '}',
              ]
              selectFields = [
                ...selectFields,
                f,
                '{',
                ...subRelModel.getFieldList(),
                '}',
              ]
            }
            relationshipFields.push('}')
            selectFields.push('}')
          } else {
            relationshipFields.push('}')
            selectFields = [e, whereRels, '{', ...relModel.getFieldList(), '}']
          }
        } else if (
          relField.relType === 'many' &&
          relField.fetch_policy === 'always'
        ) {
          const relManyModel = relField.ref
          selectFields = [e, '{', ...relManyModel.getFieldList()]

          selectFields.push('}')
        }
        relationshipReturnFields = [
          ...relationshipReturnFields,
          ...selectFields,
        ]
      }
    }
    if (model.getAggregateFieldList().length > 0) {
      for (let a = 0; a < model.getAggregateFieldList().length; a++) {
        const agf = model.getAggregateFieldList()[a]
        const condition = agf.condition ? agf.condition : ''
        const selectQuery = [
          `${agf.key} : ${agf.name}_aggregate${condition}`,
          '{ aggregate {',
          agf.function,
        ]
        if (agf.function === 'sum') {
          selectQuery.push(`{${agf.column}}`)
        }
        selectQuery.push('}}')
        aggregateFields = [aggregateFields, ...selectQuery]
      }
    }
    const returnFields = [
      '{',
      ...model.getFieldList(),
      ...relationshipReturnFields,
      ...aggregateFields,
      '}',
    ].join(' ')
    return { mainTable: returnFields, relationshipTable: relationshipFields }
  },

  getListQuery(
    model,
    options,
    where = '',
    relationships,
    params = '',
    order = {},
    where_rels = []
  ) {
    console.log('get listrelationships ==>>>', model)
    const returnFields = this.getReturnFields(model, relationships, where_rels)
    console.log('get list ==>>>', returnFields)
    const relationshipTable =
      returnFields.relationshipTable.length > 0
        ? returnFields.relationshipTable.join(' ')
        : ''
    const queryConditions = []
    const orderBy = `order_by: {${order.key ? order.key : model.key.key}: ${
      order.direction ? order.direction : 'asc'
    }}`

    queryConditions.push(orderBy)

    if (where) {
      queryConditions.push(where)
    }
    if (options.limit > 0) {
      queryConditions.push(`limit: ${options.limit}`)
    }
    if (options.offset >= 0) {
      queryConditions.push(`offset: ${options.offset}`)
    }
    const cond = '(' + queryConditions.join(',') + ')'
    const query = `query Get${model.configs.tableName}List${params} {
                ${options.alias ? options.alias + ': ' : ''}${
      model.configs.tableName
    }${cond} ${returnFields.mainTable}
                ${relationshipTable}
            }`

    console.log('query get list', query)
    return gql(query)
  },

  getByIdQuery(model, options) {
    const returnFields = this.getReturnFields(model)
    const primaryKey = model.key
    const relationshipTable =
      returnFields.relationshipTable.length > 0
        ? returnFields.relationshipTable.join(' ')
        : ''
    const query = `query Get${model.getTableName()}($objId: ${
      primaryKey.type
    }!){
      ${
        options.alias ? options.alias + ': ' : ''
      }${model.getTableName()}_by_pk(${primaryKey.name}:  $objId) ${
      returnFields.mainTable
    }
                  ${relationshipTable}
              }`
    // console.log(query)
    return gql(query)
  },

  //   getAllRelationshipQuery(depends) {
  //     var relationships = this.model.getRelationshipFieldList()
  //     var return_fields = this.getReturnFields(relationships)
  //     var depends_tables = ''
  //     if (depends) {
  //       depends_tables = this.getTablesQuery(depends).join(' ')
  //     }
  //     var relationshipTable =
  //       return_fields.relationshipTable.length > 0
  //         ? return_fields.relationshipTable.join(' ')
  //         : ''
  //     if (relationshipTable != '' || depends_tables != '') {
  //       var query = `query Get${this.model.tableName}Rel{
  //                 ${relationshipTable}
  //                 ${depends_tables}
  //             }`
  //       return gql(query)
  //     }
  //   },

  updateDataQuery(model, options, relationships) {
    const returnFields = this.getReturnFields(model, relationships)
    const primaryKey = model.key
    const params = ''
    const query = `mutation Update${model.getTableName()}($where_key: ${
      primaryKey.type
    }!, $data_update: ${model.getTableName()}_set_input = {} ${params}) {
                  update_${model.getTableName()}(where: { ${
      model.key.name
    }: { _eq: $where_key } }, _set: $data_update) {
                      affected_rows
                      returning ${returnFields.mainTable}
                  }
              }`
    return gql(query)
  },

  //   insertDataQuery(relationships) {
  //     var return_fields = this.getReturnFields(relationships)
  //     var query = `mutation Insert${this.model.tableName}($objects: [${this.model.tableName}_insert_input!]!) {
  //                 insert_${this.model.tableName}(objects: $objects) {
  //                     affected_rows
  //                     returning ${return_fields.mainTable}
  //                 }
  //             }`
  //     // console.log(query);
  //     return gql(query)
  //   },
  //   upsertDataQuery(onconflict_key, updateCols) {
  //     var return_fields = this.getReturnFields()
  //     var query = `mutation Insert${this.model.tableName}($objects: [${this.model.tableName}_insert_input!]!) {
  //                 insert_${this.model.tableName}(objects: $objects, on_conflict: {constraint: ${onconflict_key}, update_columns: ${updateCols}}) {
  //                     affected_rows
  //                     returning ${return_fields.mainTable}
  //                 }
  //             }`
  //     // console.log(query);
  //     return gql(query)
  //   },

  deleteDataQuery(model, options) {
    const primaryKey = model.key
    const query = `mutation Delete${model.getTableName()}($where_key: ${
      primaryKey.type
    }!) {
                  delete_${model.getTableName()}(where: {${
      primaryKey.name
    }: {_eq: $where_key}}) {
                      affected_rows
                  }
              }`
    return gql(query)
  },
}
