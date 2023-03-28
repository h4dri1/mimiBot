# mimiBot 0.1.0

Un bot matrix basé sur le sdk matrix-bot pour télécharger des torrents automatiquement avec rTorrent (rutorrent). Utilisation de Jackett pour aggréger les torrents via le scrapping de sites et de flaresolverr pour résoudre le capcha (yggtorrent). Jackett fourni une API pour trouver le lien du torrent et rutorrent accept un curl contenant le fichier torrent on peut donc automatiser le téléchargement des torrents.

-------------------------------------------------------

### Prérequis :

-rtorrent + rutorrent
-Jackett + flaresolverr
-Serveur matrix
-Node >= 18
-Un compte themoviedb.org (API key)

-------------------------------------------------------

### Installation :

- 1/ Installez NodeJs >= 18 et pnpm si vous ne les avez pas encore.
- 2/ Cloner le dépot en local :
```bash
git clone git@github.com:h4dri1/mimiBot
```
- 3/ Installer les dependances :
```bash
pnpm i
```
- 4/ Configurer le fichier.env
```bash
mv ./config/default_ex.yaml ./config/default.yaml
```

---------------------------------------------------------

### Configuration

Créer un utilisateur pour votre bot et récupérer son access_token à placer dans le fichier de configuration. 
Renseignez aussi votre clé API tmdb, votre clé Jackett et votre mot de passe base64 de rutorrent (https).
Invitez le bot dans un salon ou une conversation privé et activer le chiffrage de bout en bout.

----------------------------------------------------------

### Commandes

Pour n'importe qu'elle intéraction le mot clé est : 

  !mimi

Pour télécharger un film ou une série :

  !mimi trouve

Par exemple:

  !mimi trouve Interstellar

De cette manière le bot posera plusieurs questions afin de mieux coller au critères de selections du torrent.
Mais il est possible de passer directement des paramètres pour éviter les questions supplémentaires.

-Pour chercher un film et préciser l'année de sortie:

  !mimi trouve Interstellar -y 2014

-Pour chercher une série et préciser la saison:

  !mimi trouve Game of Thrones -e S01

-Pour chercher une série et préciser la saison et l'épisode:

  !mimi trouve Game of Thrones -e S01E01

Vous pouvez aussi préciser la qualité du torrent que vous souhaitez trouver en ajoutant -q 1, -q 2, -q 3 ou -q 4.

Par exemple:

  !mimi trouve Interstellar -y 2014 -q 1

 -La qualité 1 correspond à une TV 4K et une exellente connexion internet est nécessaire pour le visionner.
 -La qualité 2 correspond à une TV HD et une bonne connexion internet est nécessaire pour le visionner.
 -La qualité 3 correspond à une TV 4K et une connexion internet moyenne est nécessaire pour le visionner.
 -La qualité 4 correspond à une TV HD et une connexion internet moyenne est nécessaire pour le visionner.

Une fois le torrent trouvé, il est envoyé sur rutorrent pour être téléchargé.