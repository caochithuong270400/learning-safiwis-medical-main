<template>
  <v-container id="dashboard" tag="section">
    <!-- Chào mừng đến hệ thống quản lý bệnh viện -->
    <v-row>
      <v-col cols="12" sm="6" lg="6" xl="6" md="6">
        <base-material-chart-card
          v-if="loaded"
          :data="receptionNewMonthChart.data"
          :options="receptionNewMonthChart.options"
          :responsive-options="receptionNewMonthChart.responsiveOptions"
          color="#E91E63"
          type="Bar"
        >
          <!-- <template #reveal-actions>
            <v-tooltip bottom>
              <template #activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template #activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template> -->

          <h4 class="card-title font-weight-light mt-2 ml-2">Tiếp nhận</h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Số tiếp nhận mới theo từng tháng
          </p>

          <template #actions>
            <v-icon class="mr-1" small> mdi-clock-outline </v-icon>
            <span class="caption grey--text font-weight-light"
              >updated 0 seconds ago</span
            >
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" sm="6" lg="6" xl="6" md="6">
        <base-material-chart-card
          v-if="loaded"
          :data="patientNewMonthChart.data"
          :options="patientNewMonthChart.options"
          :responsive-options="patientNewMonthChart.responsiveOptions"
          color="info"
          hover-reveal
          type="Bar"
        >
          <!-- <template #reveal-actions>
            <v-tooltip bottom>
              <template #activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template #activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template> -->

          <h4 class="card-title font-weight-light mt-2 ml-2">Bệnh nhân</h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Số bệnh nhân mới theo từng tháng
          </p>

          <template #actions>
            <v-icon class="mr-1" small> mdi-clock-outline </v-icon>
            <span class="caption grey--text font-weight-light"
              >updated 0 seconds ago</span
            >
          </template>
        </base-material-chart-card>
      </v-col>

      <!-- <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="dailySalesChart.data"
          :options="dailySalesChart.options"
          color="success"
          hover-reveal
          type="Line"
        >
          <template #reveal-actions>
            <v-tooltip bottom>
              <template #activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template #activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">Daily Sales</h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            <v-icon color="green" small> mdi-arrow-up </v-icon>
            <span class="green--text">55%</span>&nbsp; increase in today's sales
          </p>

          <template #actions>
            <v-icon class="mr-1" small> mdi-clock-outline </v-icon>
            <span class="caption grey--text font-weight-light"
              >updated 4 minutes ago</span
            >
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="dataCompletedTasksChart.data"
          :options="dataCompletedTasksChart.options"
          hover-reveal
          color="info"
          type="Line"
        >
          <template #reveal-actions>
            <v-tooltip bottom>
              <template #activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template #activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h3 class="card-title font-weight-light mt-2 ml-2">
            Completed Tasks
          </h3>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Last Last Campaign Performance
          </p>

          <template #actions>
            <v-icon class="mr-1" small> mdi-clock-outline </v-icon>
            <span class="caption grey--text font-weight-light"
              >campaign sent 26 minutes ago</span
            >
          </template>
        </base-material-chart-card>
      </v-col> -->

      <v-col cols="12" sm="6" lg="6" xl="6" md="6">
        <base-material-stats-card
          color="info"
          icon="mdi-poll"
          title="Số bệnh nhân mới hôm nay"
          :value="getTotalData(totalDataPatientToday)"
          sub-icon="mdi-clock"
          sub-text="updated 0 seconds ago"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="6" xl="6" md="6">
        <base-material-stats-card
          color="info"
          icon="mdi-poll"
          title="Số tiếp nhận mới hôm nay"
          :value="getTotalData(totalDataReceptionToday)"
          sub-icon="mdi-clock"
          sub-text="updated 0 seconds ago"
        />
      </v-col>

      <!-- <v-col cols="12" md="6">
        <base-material-card color="warning" class="px-5 py-3">
          <template #heading>
            <div class="display-2 font-weight-light">Employees Stats</div>

            <div class="subtitle-1 font-weight-light">
              New employees on 15th September, 2016
            </div>
          </template>
          <v-card-text>
            <v-data-table :headers="headers" :items="items" />
          </v-card-text>
        </base-material-card>
      </v-col>

      <v-col cols="12" md="6">
        <base-material-card class="px-5 py-3">
          <template #heading>
            <v-tabs
              v-model="tabs"
              background-color="transparent"
              slider-color="white"
            >
              <span
                class="subheading font-weight-light mx-3"
                style="align-self: center"
                >Tasks:</span
              >
              <v-tab class="mr-3">
                <v-icon class="mr-2"> mdi-bug </v-icon>
                Bugs
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2"> mdi-code-tags </v-icon>
                Website
              </v-tab>
              <v-tab>
                <v-icon class="mr-2"> mdi-cloud </v-icon>
                Server
              </v-tab>
            </v-tabs>
          </template> -->

      <!-- <v-tabs-items v-model="tabs" class="transparent">
            <v-tab-item v-for="n in 3" :key="n">
              <v-card-text>
                <template v-for="(task, i) in tasks[tabs]">
                  <v-row :key="i" align="center">
                    <v-col cols="1">
                      <v-list-item-action>
                        <v-checkbox v-model="task.value" color="secondary" />
                      </v-list-item-action>
                    </v-col>

                    <v-col cols="9">
                      <div class="font-weight-light" v-text="task.text" />
                    </v-col>

                    <v-col cols="2" class="text-right">
                      <v-icon class="mx-1"> mdi-pencil </v-icon>
                      <v-icon color="error" class="mx-1"> mdi-close </v-icon>
                    </v-col>
                  </v-row>
                </template>
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </base-material-card> -->
      <!-- </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import moment from 'moment-timezone'
export default {
  name: 'DashboardDashboard',

  data() {
    return {
      loaded: false,
      dateNow: null,
      monthNow: null,
      yearNow: null,
      totalDataPatientToday: [],
      totalDataReceptionToday: [],
      dailySalesChart: {
        data: {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [[12, 17, 7, 17, 23, 18, 38]],
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      dataCompletedTasksChart: {
        data: {
          labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]],
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      emailsSubscriptionChart: {
        data: {
          labels: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
          ],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
          ],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
        },
        responsiveOptions: [
          [
            'screen and (max-width: 640px)',
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: (value) => value[0],
              },
            },
          ],
        ],
      },
      patientNewMonthChart: {
        data: {
          labels: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
          ],
          series: [[]],

          // series: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 20,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
        },
        responsiveOptions: [
          [
            'screen and (max-width: 640px)',
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: (value) => value[0],
              },
            },
          ],
        ],
      },
      receptionNewMonthChart: {
        data: {
          labels: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
          ],
          series: [[]],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 20,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
        },
        responsiveOptions: [
          [
            'screen and (max-width: 640px)',
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: (value) => value[0],
              },
            },
          ],
        ],
      },
      headers: [
        {
          sortable: false,
          text: 'ID',
          value: 'id',
        },
        {
          sortable: false,
          text: 'Name',
          value: 'name',
        },
        {
          sortable: false,
          text: 'Salary',
          value: 'salary',
          align: 'right',
        },
        {
          sortable: false,
          text: 'Country',
          value: 'country',
          align: 'right',
        },
        {
          sortable: false,
          text: 'City',
          value: 'city',
          align: 'right',
        },
      ],
      items: [
        {
          id: 1,
          name: 'Dakota Rice',
          country: 'Niger',
          city: 'Oud-Tunrhout',
          salary: '$35,738',
        },
        {
          id: 2,
          name: 'Minerva Hooper',
          country: 'Curaçao',
          city: 'Sinaai-Waas',
          salary: '$23,738',
        },
        {
          id: 3,
          name: 'Sage Rodriguez',
          country: 'Netherlands',
          city: 'Overland Park',
          salary: '$56,142',
        },
        {
          id: 4,
          name: 'Philip Chanley',
          country: 'Korea, South',
          city: 'Gloucester',
          salary: '$38,735',
        },
        {
          id: 5,
          name: 'Doris Greene',
          country: 'Malawi',
          city: 'Feldkirchen in Kārnten',
          salary: '$63,542',
        },
      ],
      tabs: 0,
      tasks: {
        0: [
          {
            text:
              'Sign contract for "What are conference organizers afraid of?"',
            value: true,
          },
          {
            text:
              'Lines From Great Russian Literature? Or E-mails From My Boss?',
            value: false,
          },
          {
            text:
              'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
            value: false,
          },
          {
            text: 'Create 4 Invisible User Experiences you Never Knew About',
            value: true,
          },
        ],
        1: [
          {
            text:
              'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
            value: true,
          },
          {
            text:
              'Sign contract for "What are conference organizers afraid of?"',
            value: false,
          },
        ],
        2: [
          {
            text:
              'Lines From Great Russian Literature? Or E-mails From My Boss?',
            value: false,
          },
          {
            text:
              'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
            value: true,
          },
          {
            text:
              'Sign contract for "What are conference organizers afraid of?"',
            value: true,
          },
        ],
      },
      list: {
        0: false,
        1: false,
        2: false,
      },
    }
  },
  apollo: {
    totalDataPatientToday: {
      query() {
        const today = new Date()
        this.dateNow =
          today.getFullYear() +
          '-' +
          (today.getMonth() + 1) +
          '-' +
          today.getDate()
        console.log('today.getMonth()', today)
        console.log('today.getMonth()+ 1', today.getMonth() + 1)
        this.monthNow = today.getMonth() + 1
        this.yearNow = today.getFullYear()
        const date2 = this.dateNow + ' ' + '23:59:59'
        const queryl = gql`query getTotalPatient{
            totalDataPatientToday: patients_aggregate(where: { created_at:{ _gte: "${this.dateNow}", _lt: "${date2}" } }) {
                aggregate {
                    count
                }
            }
        }`
        console.log('asdasd', this.totalDataPatientToday)
        return queryl
      },
      skip() {
        return !this.totalDataPatientToday
      },
    },
    totalDataReceptionToday: {
      query() {
        const date2 = this.dateNow + ' ' + '23:59:59'
        const queryl = gql`query getTotalReceptions{
            totalDataReceptionToday: receptions_aggregate(where: { reception_time:{ _gte: "${this.dateNow}", _lt: "${date2}" } }) {
                aggregate {
                    count
                }
            }
        }`
        console.log('asdasd', this.totalDataReceptionToday)
        return queryl
      },
      skip() {
        return !this.totalDataReceptionToday
      },
    },
  },
  computed: {
    chartData() {
      return this.data
    },
  },
  watch: {},
  created() {
    this.initialize()
  },

  mounted() {
    this.getDataInMonth('patients')
    this.getDataInMonth('receptions')
  },

  methods: {
    initialize() {},

    complete(index) {
      this.list[index] = !this.list[index]
    },
    getTotalData(modelTotal) {
      if (modelTotal && modelTotal.aggregate) {
        return modelTotal.aggregate.count
      } else return 0
    },
    getDataInMonth(nameModel) {
      console.log('query', nameModel)
      let querySearch = `query getTotal${nameModel}{`
      for (let month = 0; month < 12; month++) {
        let month1 = ''
        let month2 = ''
        month1 = moment(new Date(new Date().getFullYear(), month, 1)).format(
          'YYYY-MM-DD'
        )
        if (month === 11) {
          month2 = moment(new Date(new Date().getFullYear() + 1, 0, 1)).format(
            'YYYY-MM-DD'
          )
        } else {
          month2 = moment(
            new Date(new Date().getFullYear(), month + 1, 1)
          ).format('YYYY-MM-DD')
        }
        const tempString = `total${nameModel}Month${month}: ${nameModel}_aggregate(where: { created_at:{ _gte: "${month1}", _lt: "${month2}" } }) {aggregate {count}}`
        querySearch = querySearch + tempString
        if (month === 11) {
          querySearch = querySearch + '}'
        }
      }
      console.log('query', querySearch)

      this.$apollo
        .query({
          query: gql`
            ${querySearch}
          `,
          fetchPolicy: 'network-only',
        })
        .then((response) => {
          if (nameModel === 'patients') {
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth0.aggregate.count
            )
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth1.aggregate.count
            )
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth2.aggregate.count
            )
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth3.aggregate.count
            )
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth4.aggregate.count
            )
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth5.aggregate.count
            )
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth6.aggregate.count
            )
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth7.aggregate.count
            )
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth8.aggregate.count
            )
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth9.aggregate.count
            )
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth10.aggregate.count
            )
            this.patientNewMonthChart.data.series[0].push(
              response.data.totalpatientsMonth11.aggregate.count
            )
          } else if (nameModel === 'receptions') {
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth0.aggregate.count
            )
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth1.aggregate.count
            )
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth2.aggregate.count
            )
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth3.aggregate.count
            )
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth4.aggregate.count
            )
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth5.aggregate.count
            )
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth6.aggregate.count
            )
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth7.aggregate.count
            )
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth8.aggregate.count
            )
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth9.aggregate.count
            )
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth10.aggregate.count
            )
            this.receptionNewMonthChart.data.series[0].push(
              response.data.totalreceptionsMonth11.aggregate.count
            )
            // this.receptionNewMonthChart.data.series[0][index] =
            //   response.data.totalreceptionsMonth.aggregate.count
          }
          this.loaded = true
        })
        .catch((response) => console.log(response))
    },
  },
}
</script>
