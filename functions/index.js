const functions = require('firebase-functions')

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin')
admin.initializeApp()
const secret = 'bxwKvvbkqg96S772fzEV2EHh3VKjYAs4'

exports.processSignUp = functions.auth.user().onCreate((user) => {
  // console.log(user);
  // Check if user meets role criteria:
  // Your custom logic here: to decide what roles and other `x-hasura-*`
  // should the user get
  const customClaims = {
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'user',
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-user-id': user.uid,
    },
  }

  if (user.customClaims && user.customClaims['https://hasura.io/jwt/claims']) {
    return
  }

  // Set custom user claims on this newly created user.
  return admin
    .auth()
    .setCustomUserClaims(user.uid, customClaims)
    .then(() => {})
    .catch((error) => {
      console.log(error)
    })
})

exports.deleteAccount = functions.https.onRequest((req, res) => {
  const reqHeader = req.get('x-secret')
  if (reqHeader != secret) {
    res.status(403).send('Wrong secret')
    return
  }
  const data = req.body.event.data.old
  const userId = data.id
  admin
    .auth()
    .deleteUser(userId)
    .then(function () {
      console.log('Successfully deleted user')
      res.send('Deleted')
    })
    .catch(function (error) {
      console.log('Error deleting user:', error)
      res.send('Deleted')
    })
})

exports.actionHandler = functions.https.onRequest((req, res) => {
  const reqHeader = req.get('x-secret')
  if (reqHeader != secret) {
    res.status(403).send('Wrong secret')
    return
  }

  const action = req.body.action.name
  if (action == 'createUser') {
    const email = req.body.input.email
    const password = req.body.input.password
    const fullname = req.body.input.fullname

    // console.log(req.body);
    admin
      .auth()
      .createUser({
        email: email,
        emailVerified: true,
        password: password,
        displayName: fullname,
      })
      .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        // console.log('Successfully created new user:', userRecord.uid);
        return res.status(200).send({ uid: userRecord.uid })
      })
      .catch(function (error) {
        // console.log('Error creating new user:', error);
        return res.status(400).json({
          message: error,
        })
      })
  } else if (action == 'createUserPhone') {
    const phone = req.body.input.phone
    const fullname = req.body.input.fullname

    // console.log(req.body);
    admin
      .auth()
      .createUser({
        phoneNumber: phone,
        displayName: fullname,
      })
      .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        // console.log('Successfully created new user:', userRecord.uid);
        return res.status(200).send({ uid: userRecord.uid })
      })
      .catch(function (error) {
        // console.log('Error creating new user:', error);
        return res.status(400).json({
          message: error,
        })
      })
  } else if (action == 'changePassword') {
    const uid = req.body.input.uid
    const password = req.body.input.password

    // console.log(req.body);
    admin
      .auth()
      .updateUser(uid, {
        password: password,
      })
      .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        // console.log('Successfully change user:', userRecord.uid);
        return res.status(200).send({ uid: userRecord.uid })
      })
      .catch(function (error) {
        // console.log('Error creating new user:', error);
        return res.status(400).json({
          message: error,
        })
      })
  } else if (action == 'sendPushMessage') {
    // console.log(req.body);
    const notification = req.body.input.notification
    const devices = req.body.input.devices
    const listDevices = []
    for (let i = 0; i < devices.length; i++) {
      const device = devices[i]
      listDevices.push(device.token)
    }
    const payload = {
      notification: {
        // title: notification.title,
        body: notification.content,
        type: notification.type,
      },
    }
    if (listDevices.length > 0)
      admin.messaging().sendToDevice(listDevices, payload)
    // For each message check if there was an error.
    return res.status(200).send({ message: 'sent' })
  } else {
    res.status(404).json({
      message: 'Action not found',
    })
  }
})

exports.sendPushMessage = functions.https.onRequest((req, res) => {
  const reqHeader = req.get('x-secret')
  if (reqHeader != secret) {
    res.status(403).send('Wrong secret')
    return
  }

  const data = req.body.event.data.new
  // const users = data.list_token ? data.list_token : data.list_token_str.split(',');
  // console.log('list data', data)
  // console.log('list user', data.list_token_str.split(','))
  const listUserVN = []
  const listUserEN = []
  // var result = []
  if (data.list_token) {
    const users = data.list_token
    for (let i = 0; i < users.length; i++) {
      const user = users[i]

      if (user.language == 'en') {
        listUserEN.push(user.token)
      } else {
        listUserVN.push(user.token)
      }
    }
  } else {
    const listTokenStr = JSON.parse(data.list_token_str)
    // console.log('list token str', listTokenStr)
    for (let i = 0; i < listTokenStr.length; i++) {
      const userStr = listTokenStr[i]
      // console.log('user json', user_str)
      if (userStr.language == 'en') {
        listUserEN.push(userStr.token)
      } else {
        listUserVN.push(userStr.token)
      }
    }
  }
  // console.log('list user vn', listUserVN)
  // console.log('list user en', listUserEN)

  const payload = {
    notification: {
      title: data.title,
      body: data.content,
      // type: data.type,
    },
    data: {
      type: data.type,
    },
  }
  const payloadEn = {
    notification: {
      title: data.title_en,
      body: data.content_en,
      // type: data.type,
    },
    data: {
      type: data.type,
    },
  }
  if (data.object_id) {
    payload.data.object_id = '' + data.object_id
    payloadEn.data.object_id = '' + data.object_id
  }
  if (data.img_src) {
    payload.data.img_src = '' + data.img_src
    payloadEn.data.img_src = '' + data.img_src
  }
  if (data.click_action) {
    payload.data.click_action = '' + data.click_action
    payloadEn.data.click_action = '' + data.click_action
  }

  if (listUserVN.length > 0)
    admin
      .messaging()
      .sendToDevice(listUserVN, payload)
      .then(function (response) {
        // console.log('Successfully sent message:', response)
        for (let i = 0; i < response.results.length; i++) {
          const element = response.results[i]
          if (element.error) {
            console.log('Error', element.error)
          }
        }
        // result.push(response.results)
      })
      .catch(function (error) {
        console.log('Error sending message:', error)
        // result += error
      })
  if (listUserEN.length > 0)
    admin
      .messaging()
      .sendToDevice(listUserEN, payloadEn)
      .then(function (response) {
        // console.log('Successfully sent message:', response)
        for (let i = 0; i < response.results.length; i++) {
          const element = response.results[i]
          if (element.error) {
            console.log('Error', element.error)
          }
        }
        // result += response
      })
      .catch(function (error) {
        console.log('Error sending message:', error)
        // result += error
      })

  // For each message check if there was an error.
  return res.status(200).send({ message: 'result' })
})

exports.updateClaims = functions.https.onRequest((req, res) => {
  const reqHeader = req.get('x-secret')
  if (reqHeader != secret) {
    res.status(403).send('Wrong secret')
    return
  }

  // Grab the text parameter.
  const data = req.body.event.data.new
  const userId = data.id
  const role = data.role
  const company = data.company_id

  const customClaims = {
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': role,
      'x-hasura-allowed-roles': [role],
      'x-hasura-user-id': userId,
      'x-hasura-company-id': '' + company,
    },
  }
  setTimeout(function () {
    admin
      .auth()
      .setCustomUserClaims(userId, customClaims)
      .then(() => {})
      .catch((error) => {
        console.log(error)
      })

    res.send('Updated')
  }, 2000)
})
