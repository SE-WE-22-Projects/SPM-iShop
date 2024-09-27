import { Box } from "@mui/material";

const MapEditor = () => {
    return <Box width="100%" overflow={"scroll"} maxHeight={"80vh"} maxWidth="100%">
        <MapGrid height={100} width={100} />
    </Box>
}

interface MapGridProps {
    width: number
    height: number
}

const TileSize = 32;


const MapGrid = ({ width, height }: MapGridProps) => {

    const makeRow = (x: number) => {
        let tiles = [];

        for (let y = 0; y < height; y++) {
            tiles.push(<Box onMouseOver={() => console.log("hover")} sx={{
                borderStyle: "solid",
                borderColor: "green",
                borderWidth: "1px",
                minWidth: TileSize,
                minHeight: TileSize,
                flexGrow: "0",
                padding: "0",
                margin: "0",
                fontSize: "0.7rem"
            }}>{x * 100 + y}</Box>)
        }

        return tiles;
    }

    let rows = [];
    for (let x = 0; x < width; x++) {
        rows.push(<Box display={"flex"}>{makeRow(x)}</Box>)
    }


    return <Box mx={`${TileSize / 4}px`} my={`${TileSize / 4}px`} width={TileSize * width} height={TileSize * height} padding="0">
        {rows}
    </Box>;
}

export default MapEditor;
