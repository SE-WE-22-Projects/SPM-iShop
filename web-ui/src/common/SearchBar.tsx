import { Search } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'

const SearchBar = ({ onSearch }: { onSearch: (str: string) => any }) => {
    return (
        <div>
            <TextField
                placeholder="Search"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
                variant="outlined"
                size={"small"}
                onChange={(e) => {
                    onSearch(e.target.value);
                }}
            />
        </div>
    )
}

export default SearchBar;