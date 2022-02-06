import {Component} from 'react'

import {FiEdit} from 'react-icons/fi'
import {AiOutlineDelete} from 'react-icons/ai'
import './index.css'

class User extends Component {
  state = {
    editedName: '',
    editedEmail: '',
    editedRole: '',
    editMode: false,
  }

  onClickDelete = () => {
    const {deleteUser, users} = this.props
    const {id} = users
    deleteUser(id)
  }

  saveEditedUser = () => {
    const {editedName, editedEmail, editedRole} = this.state
    const {users, updateUser} = this.props
    const {id} = users
    const editedUser = {
      id,
      name: editedName,
      email: editedEmail,
      role: editedRole,
    }

    updateUser(editedUser)
    this.setState({
      editMode: false,
    })
  }

  onChangeRole = event => {
    this.setState({
      editedRole: event.target.value,
    })
  }

  onChangeEmail = event => {
    this.setState({
      editedEmail: event.target.value,
    })
  }

  onChangeName = event => {
    this.setState({
      editedName: event.target.value,
    })
  }

  onClickEdit = () => {
    const {users} = this.props
    const {name, email, role} = users
    this.setState(prevState => ({
      editedName: name,
      editedEmail: email,
      editedRole: role,
      editMode: !prevState.editMode,
    }))
  }

  toggleCheckbox = () => {
    const {onChangeUserCheckbox, users} = this.props
    const {id} = users
    onChangeUserCheckbox(id)
  }

  render() {
    const {editMode, editedName, editedEmail, editedRole} = this.state
    const {users} = this.props
    const {name, email, role, isChecked} = users

    return (
      <li className="user-item">
        {editMode ? (
          <div className="editor-mode-container">
            <input
              className="username-input"
              type="text"
              value={editedName}
              onChange={this.onChangeName}
              placeholder="USERNAME"
            />
            <input
              type="text"
              className="user-email-input"
              value={editedEmail}
              onChange={this.onChangeEmail}
              placeholder="EMAIL"
            />
            <input
              type="text"
              className="user-role-input"
              value={editedRole}
              onChange={this.onChangeRole}
              placeholder="ROLE"
            />
            <button
              type="button"
              className="save-button"
              onClick={this.saveEditedUser}
            >
              SAVE
            </button>
          </div>
        ) : (
          <>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={this.toggleCheckbox}
              className="user-checkbox"
            />
            <p className="user-content">{name}</p>
            <p className="user-content">{email}</p>
            <p className="user-content">{role}</p>
            <div className="actionsContainer">
              <FiEdit className="edit-icon" onClick={this.onClickEdit} />
              <AiOutlineDelete
                className="delete-user-icon"
                onClick={this.onClickDelete}
              />
            </div>
          </>
        )}
      </li>
    )
  }
}
export default User
