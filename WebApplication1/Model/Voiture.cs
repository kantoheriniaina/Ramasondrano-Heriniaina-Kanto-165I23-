namespace WebApplication1.Model
{
    public class Voiture
    {
        public int Id { get; set; }
        public string Marque { get; set; } = string.Empty;
        public string Modele { get; set; } = string.Empty;
        public int Annee { get; set; }
        public string Couleur { get; set; } = string.Empty;
    }
}
