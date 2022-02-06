import {Component} from 'react'
import {TailSpin} from 'react-loader-spinner'
import User from '../User'
import Pagination from '../Pagination'
import './index.css'

const requestStatusConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILED',
}

class Admin extends Component {
  state = {
    users: [],
    requestStatus: 'LOADING',
    pagesCount: 0,
    selectAll: false,
    userSearchInput: '',
  }

  componentDidMount = () => {
    this.getUsers()
  }

  getUsers = async () => {
    this.setState({
      requestStatus: 'LOADING',
    })

    const url =
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'

    const response = await fetch(url)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedUsers = fetchedData.map(eachUser => ({
        ...eachUser,
        isChecked: false,
      }))
      this.setState({
        users: updatedUsers,
        requestStatus: 'SUCCESS',
      })
    } else {
      this.setState({
        requestStatus: 'FAILED',
      })
    }
  }

  navigateTo = pageNum => {
    this.setState({
      pagesCount: pageNum - 1,
    })
  }

  getCheckedUsers = users => {
    const checkedUsers = users.map(user => {
      if (user.isChecked === true) {
        return user.id
      }
      return null
    })
    return checkedUsers
  }

  deleteSelected = () => {
    const {users} = this.state
    const checkedUsersIds = this.getCheckedUsers(users)
    const updatedUsers = users.filter(
      eachUser => !checkedUsersIds.includes(eachUser.id),
    )
    this.setState({
      users: updatedUsers,
      selectAll: false,
    })
  }

  onClickDelete = id => {
    const {users} = this.state
    const remainingUsers = users.filter(eachUser => eachUser.id !== id)
    this.setState({
      users: remainingUsers,
    })
  }

  updateUser = userData => {
    const {users} = this.state
    const updatedUsersData = users.map(eachUser => {
      if (eachUser.id === userData.id) {
        return userData
      }
      return eachUser
    })
    this.setState({
      users: updatedUsersData,
    })
  }

  onChangeUserCheckbox = id => {
    const {users} = this.state
    const updatedUsers = users.map(eachUser => {
      if (eachUser.id === id) {
        const UpdatedMemberData = {
          ...eachUser,
          isChecked: !eachUser.isChecked,
        }
        return UpdatedMemberData
      }
      return eachUser
    })
    this.setState({
      users: updatedUsers,
    })
  }

  toggleCheckAllCheckboxes = () => {
    const {selectAll, users} = this.state
    this.setState({
      selectAll: !selectAll,
    })

    const searchResult = this.getSearchResult(users)
    const currentPageUsers = this.getCurrentPageUsers(searchResult)
    const currentPageUsersIds = currentPageUsers.map(eachUser => eachUser.id)
    if (selectAll === false) {
      const updatedUsers = users.map(eachUser => {
        if (currentPageUsersIds.includes(eachUser.id)) {
          return {...eachUser, isChecked: true}
        }
        return eachUser
      })
      this.setState({
        users: updatedUsers,
      })
    } else {
      const updatedUsers = users.map(eachUser => ({
        ...eachUser,
        isChecked: false,
      }))
      this.setState({
        users: updatedUsers,
      })
    }
  }

  onChangeUserInputValue = event => {
    this.setState({
      userSearchInput: event.target.value,
      pagesCount: 0,
    })
  }

  getCurrentPageUsers = searchResult => {
    const {pagesCount} = this.state
    const usersPerPage = 10
    const searchResultLength = searchResult.length
    const previousPagesUsers = pagesCount * usersPerPage
    const remainingUsers = searchResultLength - previousPagesUsers
    let presentPageUsers = []
    if (remainingUsers <= usersPerPage) {
      presentPageUsers = searchResult.slice(previousPagesUsers)
    } else {
      presentPageUsers = searchResult.slice(
        previousPagesUsers,
        previousPagesUsers + usersPerPage,
      )
    }
    return presentPageUsers
  }

  getSearchResult = () => {
    const {userSearchInput, users} = this.state
    const searchResult = users.filter(
      eachUser =>
        eachUser.name.toLowerCase().startsWith(userSearchInput.toLowerCase()) ||
        eachUser.email
          .toLowerCase()
          .startsWith(userSearchInput.toLowerCase()) ||
        eachUser.role.toLowerCase().startsWith(userSearchInput.toLowerCase()),
    )
    return searchResult
  }

  renderSuccessView = () => {
    const {users, pagesCount, selectAll, userSearchInput} = this.state
    const searchResult = this.getSearchResult()
    const currentPageUsers = this.getCurrentPageUsers(searchResult)

    return (
      <>
        <input
          type="search"
          value={userSearchInput}
          onChange={this.onChangeUserInputValue}
          placeholder="Search by name, email or role"
          className="user-input"
        />
        {currentPageUsers.length === 0 ? (
          <div>
            <img
              src="https://res.cloudinary.com/aguruprasad/image/upload/v1644149686/no-users-found_3_km6yk0.png"
              className="not-found-image"
              alt="no users found"
            />
          </div>
        ) : (
          <ul className="users-list">
            <li className="list-header">
              <input
                checked={selectAll}
                onChange={this.toggleCheckAllCheckboxes}
                type="checkbox"
                className="header-checkbox"
              />
              <h1 className="header-name">Name</h1>
              <h1 className="header-email">Email</h1>
              <h1 className="header-role">Role</h1>
              <h1 className="header-actions">Actions</h1>
            </li>
            {currentPageUsers.map(eachUser => (
              <User
                users={eachUser}
                key={eachUser.id}
                updateUser={this.updateUser}
                deleteUser={this.onClickDelete}
                onChangeUserCheckbox={this.onChangeUserCheckbox}
              />
            ))}
          </ul>
        )}

        <Pagination
          users={users}
          deleteSelected={this.deleteSelected}
          pagesCount={pagesCount}
          navigateTo={this.navigateTo}
        />
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <TailSpin height={50} width={50} />
    </div>
  )

  renderAdminPage = () => {
    const {requestStatus} = this.state
    switch (requestStatus) {
      case requestStatusConstants.loading:
        return this.renderLoadingView()

      case requestStatusConstants.success:
        return this.renderSuccessView()

      case requestStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="background-container">
        <div className="admin-page">{this.renderAdminPage()}</div>
      </div>
    )
  }
}

export default Admin
