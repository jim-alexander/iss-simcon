import moment from 'moment'

export function userActivity(deleteUser) {

  return [{
    title: 'Username',
    dataIndex: 'user.username',
    key: 'username',
  }, {
    title: 'Email',
    dataIndex: 'user.email',
    key: 'email',
  }, {
    title: 'Role',
    dataIndex: 'user.role',
    key: 'role',
  }, {
    title: 'Last Loaded',
    dataIndex: 'user.data.last_loaded_data',
    key: 'last_loaded',
    render: item => {
      if (item) {
        if (item !== 'never') {
          var b = moment(item, 'Do MMMM YYYY, h:mm:ss a');
          return (
            b.fromNow()
          )
        }
      }
    }
  }, {
    title: 'Last Page',
    dataIndex: 'user.data.last_viewed_page',
    key: 'last_page'
  }
    // , {
    //   title: 'Action',
    //   dataIndex: 'id',
    //   key: 'action',
    //   render: (record) => {
    //     if(record) {
    //       return <span onClick={() => {
    //         deleteUser(record)
    //       }}>Delete</span>

    //     }
    //   },
    // }
  ]
}
