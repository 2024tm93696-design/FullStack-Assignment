import React from 'react';
import Select from 'react-select';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

export default ({ onChange, options, value, className }) => {

    const defaultValue = (options, value) => {
        return options ? options.find(option => option.value === value) : "";
    };

    return (
        <>
         <div className='d-flex justify-content-center flex-row mt-2'>    
        <SecurityOutlinedIcon
        style={{ fontSize: "32px", opacity: "0.8",marginRight:'5px' }}
      />
            <Select
               name="sques"
               id="sques"
               className={className}
                value={defaultValue(options, value)}
                onChange={value => {
                    onChange(value)

                }}
                 options={options}
                 placeholder="Security Question" />
                </div>
        </>

    )
}