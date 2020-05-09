import React from 'react';
import Artist from './Artist';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({    
    galleryDiv: {
        position: 'relative',
        height: '90vh',
        width: '90%',
        background: 'transparent',
        display: 'table',
        margin: '0 auto'
    },
    img: {
        position: 'absolute',
        top: 0,
        left: 0,
        heigth: "100%",
        width: "100%"
    }
}));

export default function Catalog(props) { 
    const classes = useStyles();
    const [openArtist, setOpenArtist] = React.useState(false);
    const [artistEntries, setArtistEntries] = React.useState([{}])

    const mapToList = function(o, f) {
        var result = []
        Object.keys(o).forEach(k => {
            result.push(f(o[k], k, o));
        });
        return result;
    }

    const handleOpenArtist1 = (e) => {
        setOpenArtist(true);
        setArtistEntries([e]);
    };

    const handleOpenArtistN = (e) => {
        setOpenArtist(true);
        const akey = e.key.substr(0, e.key.length-2);
        setArtistEntries(data.filter(e => e.key.startsWith(akey)));
    };

    const handleCloseArtist = () => {
        setOpenArtist(false);
    };

    const [entries, setEntries] = React.useState([]);
    const [artists, setArtists] = React.useState([]);

    React.useEffect(() => {
        if (props.collections.artists == null || props.collections.entries == null) {
            return;
        }
        setArtists(props.collections.artists);
        setEntries(props.collections.entries);

    }, [props.collections.artists, props.collections.entries]);

    const getArtist = (ekey) => {
        const akey = ekey.substr(0, ekey.length-2);
        return artists[akey] == null ? null :
            `${artists[akey].first} ${artists[akey].last}`
    }

    const data = mapToList(entries, (e, key) => 
        e.title == null ? null : (
            { artist: getArtist(key), 
              key: key,
              ...e
            }
        )
    ).filter(v => v != null);

    return (
        <div className={classes.galleryDiv}>
          <Table>
              <TableHead>
                  <TableRow>
                    <TableCell>Artist</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Media</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
              {data.map(e => 
                  <TableRow key={e.key}>
                    <TableCell>
                        <Link onClick={() => { handleOpenArtistN(e) }}>{e.artist}
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Link onClick={() => { handleOpenArtist1(e) }}>{e.title}
                        </Link>
                    </TableCell>
                    <TableCell>{e.media}</TableCell>
                    <TableCell>{e.price}</TableCell>
                  </TableRow>
              )}
              </TableBody>
          </Table>
          <Dialog open={openArtist} maxWidth="md" fullWidth={true} onClose={handleCloseArtist} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Artist - {artistEntries[0].artist}</DialogTitle>
            <DialogContent>
                <Artist entries={artistEntries} size={800} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseArtist} color="primary">
                    Close
                </Button>
            </DialogActions>
          </Dialog>
        </div>
    );
}