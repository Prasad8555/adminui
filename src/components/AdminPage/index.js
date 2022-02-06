import {Component} from 'react'
import {TailSpin} from 'react-loader-spinner'
import Member from '../Member'
import Pagination from '../Pagination'
import './index.css'

const requestStatusConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILED',
}

class Admin extends Component {
  state = {
    members: [],
    requestStatus: 'LOADING',
    pagesCount: 0,
    selectAll: false,
    userSearchInput: '',
  }

  componentDidMount = () => {
    this.getMembers()
  }

  getMembers = async () => {
    this.setState({
      requestStatus: 'LOADING',
    })

    const url =
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'

    const response = await fetch(url)

    if (response.ok === true) {
      const members = await response.json()
      const updatedMembers = members.map(eachMember => ({
        ...eachMember,
        isChecked: false,
      }))
      this.setState({
        members: updatedMembers,
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
    const {members} = this.state
    const checkedUsersIds = this.getCheckedUsers(members)
    const updatedUsers = members.filter(
      eachUser => !checkedUsersIds.includes(eachUser.id),
    )
    this.setState({
      members: updatedUsers,
      selectAll: false,
    })
  }

  onClickDelete = id => {
    const {members} = this.state
    const remainingMembers = members.filter(each => each.id !== id)
    this.setState({
      members: remainingMembers,
    })
  }

  updateUser = userData => {
    const {members} = this.state
    const updatedUsersData = members.map(eachUser => {
      if (eachUser.id === userData.id) {
        return userData
      }
      return eachUser
    })
    this.setState({
      members: updatedUsersData,
    })
  }

  onChangeMemberCheckbox = id => {
    const {members} = this.state
    const updatedMembers = members.map(eachMember => {
      if (eachMember.id === id) {
        const UpdatedMemberData = {
          ...eachMember,
          isChecked: !eachMember.isChecked,
        }
        return UpdatedMemberData
      }
      return eachMember
    })
    this.setState({
      members: updatedMembers,
    })
  }

  toggleCheckAllCheckboxes = () => {
    const {selectAll, members} = this.state
    this.setState({
      selectAll: !selectAll,
    })

    const searchResult = this.getSearchResult(members)
    const currentPageMembers = this.getCurrentPageMembers(searchResult)
    const currentPageUsersIds = currentPageMembers.map(each => each.id)
    if (selectAll === false) {
      const updatedUsers = members.map(eachUser => {
        if (currentPageUsersIds.includes(eachUser.id)) {
          return {...eachUser, isChecked: true}
        }
        return eachUser
      })
      this.setState({
        members: updatedUsers,
      })
    } else {
      const updatedUsers = members.map(eachUser => ({
        ...eachUser,
        isChecked: false,
      }))
      this.setState({
        members: updatedUsers,
      })
    }
  }

  onChangeUserInputValue = event => {
    this.setState({
      userSearchInput: event.target.value,
      pagesCount: 0,
    })
  }

  getCurrentPageMembers = searchResult => {
    const {pagesCount} = this.state
    const membersPerPage = 10
    const searchResultLength = searchResult.length
    const previousPagesMembers = pagesCount * membersPerPage
    const remainingMembers = searchResultLength - previousPagesMembers
    let presentPageMembers = []
    if (remainingMembers <= membersPerPage) {
      presentPageMembers = searchResult.slice(previousPagesMembers)
    } else {
      presentPageMembers = searchResult.slice(
        previousPagesMembers,
        previousPagesMembers + membersPerPage,
      )
    }
    return presentPageMembers
  }

  getSearchResult = members => {
    const {userSearchInput} = this.state
    const searchResult = members.filter(
      each =>
        each.name.toLowerCase().startsWith(userSearchInput.toLowerCase()) ||
        each.email.toLowerCase().startsWith(userSearchInput.toLowerCase()) ||
        each.role.toLowerCase().startsWith(userSearchInput.toLowerCase()),
    )
    return searchResult
  }

  renderSuccessView = () => {
    const {members, pagesCount, selectAll, userSearchInput} = this.state
    const searchResult = this.getSearchResult(members)
    const currentPageMembers = this.getCurrentPageMembers(searchResult)

    return (
      <>
        <input
          type="search"
          value={userSearchInput}
          onChange={this.onChangeUserInputValue}
          placeholder="Search by name, email or role"
          className="user-input"
        />
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
          {currentPageMembers.map(each => (
            <Member
              member={each}
              key={each.id}
              updateUser={this.updateUser}
              deleteUser={this.onClickDelete}
              selectAll={selectAll}
              onChangeMemberCheckbox={this.onChangeMemberCheckbox}
            />
          ))}
        </ul>
        <Pagination
          members={members}
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
