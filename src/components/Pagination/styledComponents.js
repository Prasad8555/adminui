import styled from 'styled-components'

export const NavigationButtons = styled.button`
  color: ${value => (value.isActive ? '#0074d9' : '#ffffff')};
  border: 2px solid ${value => (value.isActive ? '#0074d9' : '#ffffff')};
  background-color: ${value => (value.isActive ? 'inherit' : '#0074d9')};
`

export const StartingNavigationButton = styled.button`
  color: ${value => (value.isDisabled ? '#fff' : 'gray')};
  border: 2px solid ${value => (value.isDisabled ? '#0074d9' : 'gray')};
  background-color: ${value => (value.isDisabled ? '#0074d9' : 'inherit')};
  padding: 12px;
  font-family: 'Roboto';
  height: 50px;
  width: 50px;
  font-weight: 600;
  border-radius: 50%;
`
export const PreviousNavigationButton = styled.button`
  color: ${value => (value.isDisabled ? '#fff' : 'gray')};
  border: 2px solid ${value => (value.isDisabled ? '#0074d9' : 'gray')};
  background-color: ${value => (value.isDisabled ? '#0074d9' : 'inherit')};
  padding: 12px;
  font-family: 'Roboto';
  height: 50px;
  width: 50px;
  font-weight: 600;
  border-radius: 50%;
`

export const ForwardNavigationButton = styled.button`
  color: ${value => (value.isDisabled ? '#fff' : 'gray')};
  border: 2px solid ${value => (value.isDisabled ? '#0074d9' : 'gray')};
  background-color: ${value => (value.isDisabled ? '#0074d9' : 'inherit')};
  padding: 12px;
  font-family: 'Roboto';
  height: 50px;
  width: 50px;
  font-weight: 600;
  border-radius: 50%;
`

export const EndNavigationButton = styled.button`
  color: ${value => (value.isDisabled ? '#fff' : 'gray')};
  border: 2px solid ${value => (value.isDisabled ? '#0074d9' : 'gray')};
  background-color: ${value => (value.isDisabled ? '#0074d9' : 'inherit')};
  padding: 12px;
  font-family: 'Roboto';
  height: 50px;
  width: 50px;
  font-weight: 600;
  border-radius: 50%;
`
