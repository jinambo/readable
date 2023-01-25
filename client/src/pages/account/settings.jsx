import { useEffect, useState } from 'react';
import useFetch from 'hooks/useFetch';
import usePopMessage from 'hooks/usePopMessage';
import methods from 'utils/methods';
import Input from 'components/atoms/input';
import Button from 'components/atoms/button';

const Settings = ({ user, setUser }) => {
  // User settings input's object state
  const [inputs, setInputs] = useState({});

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  const { data, loading, error, refetchByBody } = useFetch({
    url: 'http://localhost:4000/users/edit',
    method: methods.PATCH
  });

  const handleEdit = () => refetchByBody(inputs);

  // Update user state
  useEffect(() => {
    if (!error && data?.currentUser) {
      setUser(data.currentUser);
      show(data.message, 'success');
    } else {
      show(error, 'error');
    }
  }, [loading]);

  return (
    <div className="col-5 col-middle">
      <h2 className="section-title fg-dark p-b-1">Account settings</h2>
      <small className='p-b-2 fg-secondary'><b>Note:</b> if you change those information, you will need to wait for the approval from admin of this page.</small>

      { popup.message && popup.type === 'error' && <p className="pop-error m-b-2">{popup.message}</p> }
      { popup.message && popup.type === 'success' && <p className="pop-success m-b-2">{popup.message}</p> }

      <p className="fg-dark">Your first name</p>
      <Input
        name="name"
        type="text"
        defaultValue={ user?.name }
        styles={{ flex: 1 }}
        onChangeAction={ (e) => setInputs({ [e.target.name]: e.target.value }) }
      />

      <p className="fg-dark">Your last name</p>
      <Input
        name="lastname"
        type="text"
        defaultValue={ user?.lastname }
        styles={{ flex: 1 }}
        onChangeAction={ (e) => setInputs({ [e.target.name]: e.target.value }) }
      />

      <p className="fg-dark">Your personal number</p>
      <Input
        name="number"
        type="text"
        defaultValue={ user?.number }
        styles={{ flex: 1 }}
        onChangeAction={ (e) => setInputs({ [e.target.name]: e.target.value }) }
      />

      <p className="fg-dark">Your address</p>
      <Input
        name="address"
        type="text"
        defaultValue={ user?.address }
        styles={{ flex: 1 }}
        onChangeAction={ (e) => setInputs({ [e.target.name]: e.target.value }) }
      />

      <Button
        type="primary"
        styles={{ marginTop: '1rem', alignSelf: 'flex-start'}}
        onClickAction={ handleEdit }
      >Edit account</Button>
    </div>
  );
}

export default Settings;
