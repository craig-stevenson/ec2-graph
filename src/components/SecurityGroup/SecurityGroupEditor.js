import React from 'react'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function SecurityGroupEditor(props) {
    const {handleDialogClose, node} = props;
    const [isSaving, setIsSaving] = React.useState(false);
    const handleSave = async () => {

    }

    return (
        <form className='creds-form' noValidate autoComplete="off">
          <div>
            <TextField
              id="key-id"
              variant="outlined"
              defaultValue='Key ID'
              label='AWS Key ID'
              fullWidth
              margin="normal"
            />
          </div>
          <div>
            <TextField
              id="secret-access-key"
              variant="outlined"
              label='Secret Access Key'
              defaultValue='Secret Access Key'
              fullWidth
              margin="normal"
            />
          </div>
          <div>
            <Button
              id='save-button'
              className='save-button'
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isSaving}>
              {isSaving ? 'Saving' : 'Save'}
            </Button>
          </div>
        </form>
    )
}
