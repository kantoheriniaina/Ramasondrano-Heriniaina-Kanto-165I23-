'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button, { ButtonProps } from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Fade } from '@mui/material';

// Interface for form data
interface FormData {
  marque: string;
  modele: string;
  annee: string;
  couleur: string;
}

// Interface for errors
interface Errors {
  [key: string]: string;
}

// Interface for steps
interface StepType {
  label: string;
  description: string;
  fields: (keyof FormData)[];
}

const steps: StepType[] = [
  {
    label: 'Marque et modèle',
    description: 'Entrez la marque et le modèle de la voiture.',
    fields: ['marque', 'modele'],
  },
  {
    label: 'Année et couleur',
    description: 'Fournissez l’année de fabrication et la couleur de la voiture.',
    fields: ['annee', 'couleur'],
  },
];

// Styled components for enhanced design
const StyledBox = styled(Box)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));
const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(1, 3),
  borderRadius: 8,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
  },
}));
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: '#fff',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function VoitureFormStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState<FormData>({
    marque: '',
    modele: '',
    annee: '',
    couleur: '',
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: AlertColor;
    message: string;
    open: boolean;
  }>({
    type: 'success',
    message: '',
    open: false,
  });
  const router = useRouter();

  const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as keyof FormData]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep = () => {
    const currentStepFields = steps[activeStep].fields;
    const newErrors: Errors = {};
    currentStepFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'Ce champ est requis';
      }
      if (field === 'annee' && formData.annee && (isNaN(Number(formData.annee)) || Number(formData.annee) < 1900)) {
        newErrors[field] = 'L’année doit être un nombre supérieur à 1900';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSubmitStatus({ type: 'success', message: '', open: false });
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setSubmitStatus({ type: 'success', message: '', open: false });
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      marque: '',
      modele: '',
      annee: '',
      couleur: '',
    });
    setErrors({});
    setSubmitStatus({ type: 'success', message: '', open: false });
  };

  const handleCloseSnackbar = () => {
    setSubmitStatus((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        const response = await fetch('http://localhost:5202/api/voitures', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            marque: formData.marque,
            modele: formData.modele,
            annee: Number(formData.annee),
            couleur: formData.couleur,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
              errorData.message ||
              `Échec de la création de la voiture (Erreur ${response.status})`;
          throw new Error(errorMessage);
        }
        setSubmitStatus({ type: 'success', message: 'Voiture créée avec succès !', open: true });
        setActiveStep(steps.length);
      } catch (err) {
        const errorMessage =
            err instanceof Error ? err.message : 'Erreur inconnue lors de l’envoi des données';
        setSubmitStatus({
          type: 'error',
          message: errorMessage,
          open: true,
        });
      }
    }
  };

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
            <Fade in={activeStep === 0}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                <StyledTextField
                    label="Marque"
                    name="marque"
                    value={formData.marque}
                    onChange={handleInputChange}
                    error={!!errors.marque}
                    helperText={errors.marque}
                    fullWidth
                    variant="outlined"
                />
                <StyledTextField
                    label="Modèle"
                    name="modele"
                    value={formData.modele}
                    onChange={handleInputChange}
                    error={!!errors.modele}
                    helperText={errors.modele}
                    fullWidth
                    variant="outlined"
                />
              </Box>
            </Fade>
        );
      case 1:
        return (
            <Fade in={activeStep === 1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                <StyledTextField
                    label="Année"
                    name="annee"
                    type="number"
                    value={formData.annee}
                    onChange={handleInputChange}
                    error={!!errors.annee}
                    helperText={errors.annee}
                    fullWidth
                    variant="outlined"
                />
                <StyledTextField
                    label="Couleur"
                    name="couleur"
                    value={formData.couleur}
                    onChange={handleInputChange}
                    error={!!errors.couleur}
                    helperText={errors.couleur}
                    fullWidth
                    variant="outlined"
                />
              </Box>
            </Fade>
        );
      default:
        return null;
    }
  };

  return (
      <StyledBox>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Formulaire d'Ajout de Voiture
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ backgroundColor: 'transparent' }}>
          {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: 'medium',
                        color: activeStep >= index ? '#1a237e' : 'rgba(0, 0, 0, 0.6)',
                      },
                    }}
                    optional={
                      index === steps.length - 1 ? (
                          <Typography variant="caption">Dernière étape</Typography>
                      ) : null
                    }
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography sx={{ color: '#424242', mb: 2 }}>{step.description}</Typography>
                  {renderStepContent(index)}
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <StyledButton
                        variant="contained"
                        onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                        sx={{ mr: 2 }}
                    >
                      {index === steps.length - 1 ? 'Soumettre' : 'Continuer'}
                    </StyledButton>
                    <StyledButton
                        disabled={index === 0}
                        onClick={handleBack}
                        variant="outlined"
                        sx={{ color: '#1a237e', borderColor: '#1a237e' }}
                    >
                      Retour
                    </StyledButton>
                  </Box>
                </StepContent>
              </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
            <StyledPaper square elevation={0}>
              <Typography variant="h6" align="center" sx={{ color: '#1a237e' }}>
                Toutes les étapes sont terminées !
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <StyledButton onClick={handleReset}>Réinitialiser</StyledButton>
                <StyledButton
                    variant="outlined"
                    onClick={() => router.push('/voitures')}
                    sx={{ color: '#1a237e', borderColor: '#1a237e' }}
                >
                  Voir la liste des voitures
                </StyledButton>
              </Box>
            </StyledPaper>
        )}
        <Snackbar
            open={submitStatus.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            TransitionComponent={Fade}
        >
          <Alert
              onClose={handleCloseSnackbar}
              severity={submitStatus.type}
              iconMapping={{
                success: <CheckCircleIcon fontSize="inherit" />,
                error: <ErrorIcon fontSize="inherit" />,
              }}
              sx={{
                width: '100%',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                backgroundColor: submitStatus.type === 'success' ? '#e8f5e9' : '#ffebee',
              }}
          >
            {submitStatus.message}
          </Alert>
        </Snackbar>
      </StyledBox>
  );
}