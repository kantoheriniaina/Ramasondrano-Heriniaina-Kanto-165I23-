'use client';
import React, { useEffect, useState } from 'react';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumn } from 'mui-datatables';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CircularProgress, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText, Snackbar, Alert } from '@mui/material';
import Chip from '@mui/material/Chip';
import { TableFilterList } from 'mui-datatables';

// Interface pour les données de voiture
interface Voiture {
  id: number;
  marque: string;
  modele: string;
  annee: number;
  couleur: string;
}

// Composant pour les puces de filtre personnalisées
const CustomChip = ({ label, onDelete }: { label: string; onDelete: () => void }) => (
    <Chip variant="outlined" color="secondary" label={label} onDelete={onDelete} />
);

// Composant pour la liste de filtres personnalisée
const CustomFilterList = (props: any) => (
    <TableFilterList {...props} ItemComponent={CustomChip} />
);

export default function VoituresContent() {
  const [data, setData] = useState<Voiture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedVoiture, setSelectedVoiture] = useState<Voiture | null>(null);
  const [voitureToDelete, setVoitureToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Voiture>>({});
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Récupérer les données des voitures depuis le backend
  useEffect(() => {
    const fetchVoitures = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5202/api/voitures', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Échec de la récupération des voitures');
        }
        const voitures: Voiture[] = await response.json();
        setData(voitures);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    fetchVoitures();
  }, []);

  // Ouvrir le dialogue de mise à jour
  const handleOpenDialog = (voiture: Voiture) => {
    setSelectedVoiture(voiture);
    setFormData({
      marque: voiture.marque,
      modele: voiture.modele,
      annee: voiture.annee,
      couleur: voiture.couleur,
    });
    setOpenDialog(true);
  };

  // Fermer le dialogue de mise à jour
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVoiture(null);
    setFormData({});
  };

  // Ouvrir le dialogue de confirmation de suppression
  const handleOpenDeleteDialog = (id: number) => {
    setVoitureToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Fermer le dialogue de confirmation de suppression
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setVoitureToDelete(null);
  };

  // Fermer le snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'annee' ? parseInt(value) : value }));
  };

  // Mettre à jour une voiture
  const handleUpdate = async () => {
    if (!selectedVoiture) return;

    // Valider les données du formulaire
    if (!formData.marque || !formData.modele || !formData.annee || !formData.couleur) {
      setSnackbarMessage('Tous les champs sont requis');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5202/api/voitures/${selectedVoiture.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedVoiture.id, ...formData }), // Inclure l'id dans le corps
      });
      if (!response.ok) {
        throw new Error('Échec de la mise à jour de la voiture');
      }
      // Mettre à jour l'état local avec formData car le backend renvoie 204 No Content
      setData((prev) =>
          prev.map((voiture) =>
              voiture.id === selectedVoiture.id ? { ...voiture, ...formData } : voiture
          )
      );
      setSnackbarMessage('Voiture mise à jour avec succès');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : 'Erreur inconnue lors de la mise à jour');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Supprimer une voiture
  const handleDelete = async () => {
    if (!voitureToDelete) return;
    try {
      const response = await fetch(`http://localhost:5202/api/voitures/${voitureToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Échec de la suppression de la voiture');
      }
      setData((prev) => prev.filter((voiture) => voiture.id !== voitureToDelete));
      setSnackbarMessage('Voiture supprimée avec succès');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDeleteDialog();
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : 'Erreur inconnue lors de la suppression');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      handleCloseDeleteDialog();
    }
  };

  // Définir les colonnes du tableau
  const columns: MUIDataTableColumn[] = [
    {
      name: 'id',
      label: 'ID',
      options: {
        filter: true,
        sort: true,
        display: false, // Caché par défaut
      },
    },
    {
      name: 'marque',
      label: 'Marque',
      options: {
        filter: true,
        sort: true,
        filterType: 'textField',
      },
    },
    {
      name: 'modele',
      label: 'Modèle',
      options: {
        filter: true,
        sort: true,
        filterType: 'textField',
      },
    },
    {
      name: 'annee',
      label: 'Année',
      options: {
        filter: true,
        sort: true,
        filterType: 'textField',
      },
    },
    {
      name: 'couleur',
      label: 'Couleur',
      options: {
        filter: true,
        sort: true,
        filterType: 'textField',
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: false,
        sort: false,
        searchable: false,
        customBodyRender: (_value, tableMeta) => {
          const voiture = data[tableMeta.rowIndex];
          return (
              <Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenDialog(voiture)}
                    sx={{ mr: 1 }}
                >
                  Modifier
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleOpenDeleteDialog(voiture.id)}
                >
                  Supprimer
                </Button>
              </Box>
          );
        },
      },
    },
  ];

  // Options du tableau
  const options: MUIDataTableOptions = {
    filter: true,
    filterType: 'checkbox',
    responsive: 'vertical',
    selectableRows: 'multiple',
    selectableRowsHeader: true,
    selectableRowsOnClick: true,
    search: true,
    searchOpen: false,
    searchPlaceholder: 'Rechercher une voiture...',
    print: true,
    download: true,
    downloadOptions: {
      filename: 'voitures.csv',
      separator: ',',
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      },
    },
    viewColumns: true,
    sort: true,
    sortOrder: { name: 'marque', direction: 'asc' },
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20, 50],
    jumpToPage: true,
    textLabels: {
      body: {
        noMatch: 'Aucune voiture trouvée',
        toolTip: 'Trier',
        columnHeaderTooltip: (column) => `Trier par ${column.label}`,
      },
      pagination: {
        next: 'Page suivante',
        previous: 'Page précédente',
        rowsPerPage: 'Lignes par page :',
        displayRows: 'de',
      },
      toolbar: {
        search: 'Rechercher',
        downloadCsv: 'Télécharger le',
        print: 'Imprimer',
        viewColumns: 'Afficher les colonnes',
        filterTable: 'Filtrer la table',
      },
      filter: {
        all: 'Tous',
        title: 'FILTRES',
        reset: 'RÉINITIALISER',
      },
      viewColumns: {
        title: 'Afficher les colonnes',
        titleAria: 'Afficher/Masquer les colonnes',
      },
      selectedRows: {
        text: 'ligne(s) sélectionnée(s)',
        delete: 'Supprimer',
        deleteAria: 'Supprimer les lignes sélectionnées',
      },
    },
    onRowClick: (rowData, rowMeta) => {
      console.log('Ligne cliquée:', rowData, 'Index:', rowMeta.dataIndex);
    },
    onRowsDelete: (rowsDeleted) => {
      console.log('Lignes supprimées:', rowsDeleted.data.map((d) => data[d.dataIndex]));
      return false; // Empêche la suppression automatique des lignes
    },
    onTableChange: (action, tableState) => {
      console.log('Action:', action, 'État:', tableState);
    },
    customToolbar: () => (
        <Typography variant="h6" style={{ padding: '0 10px' }}>
          Liste des Voitures
        </Typography>
    ),
  };

  // Thème personnalisé pour le style
  const getMuiTheme = () =>
      createTheme({
        components: {
          MuiTable: {
            styleOverrides: {
              root: {
                backgroundColor: '#fff',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: '8px',
              },
              head: {
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
              },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              backgroundColor: '#f5f5f5',
            },
          },
        },
      });

  return (
      <Box sx={{ p: 2, maxWidth: '100%', overflowX: 'auto' }}>
        {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
        )}
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
              title="Liste des Voitures"
              data={data}
              columns={columns}
              options={options}
              components={{
                TableFilterList: CustomFilterList,
              }}
          />
        </ThemeProvider>
        {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
        )}
        {/* Dialogue de mise à jour */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Modifier la Voiture</DialogTitle>
          <DialogContent>
            <TextField
                margin="dense"
                name="marque"
                label="Marque"
                fullWidth
                value={formData.marque || ''}
                onChange={handleInputChange}
            />
            <TextField
                margin="dense"
                name="modele"
                label="Modèle"
                fullWidth
                value={formData.modele || ''}
                onChange={handleInputChange}
            />
            <TextField
                margin="dense"
                name="annee"
                label="Année"
                type="number"
                fullWidth
                value={formData.annee || ''}
                onChange={handleInputChange}
            />
            <TextField
                margin="dense"
                name="couleur"
                label="Couleur"
                fullWidth
                value={formData.couleur || ''}
                onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Mettre à jour
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialogue de confirmation de suppression */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer cette voiture ? Cette action est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
        {/* Snackbar pour les messages de succès/erreur */}
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
  );
}