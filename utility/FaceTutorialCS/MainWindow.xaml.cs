// <snippet_using>

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using Microsoft.Azure.CognitiveServices.Vision.Face;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
// </snippet_using>

namespace FaceTutorial
{
	public partial class MainWindow : Window
    {
        // <snippet_mainwindow_fields>
        // Add your Face subscription key to your environment variables.
        private const string subscriptionKey = "26a6dcd1fdf6490abd21e570c64a3b31";
        // Add your Face endpoint to your environment variables.
        private const string faceEndpoint = "https://hack-faceresource.cognitiveservices.azure.com/";
        // Folders that have pictures to train the Face CognitiveServices.
        private const string muyingImageDir = @"C:\Users\mucui\Pictures\Hackathon2020\Muying";
        private const string maheshImageDir = @"C:\Users\mucui\Pictures\Hackathon2020\Mahesh";
        private const string funingImageDir = @"C:\Users\mucui\Pictures\Hackathon2020\Funing";
        private const string personGroupId = "myfriends";

        private readonly IFaceClient faceClient = new FaceClient(
            new ApiKeyServiceClientCredentials(subscriptionKey),
            new System.Net.Http.DelegatingHandler[] { });

        // The list of detected faces.
        private IList<DetectedFace> faceList;
        // The detected face name.
        private string faceName;
        // The list of descriptions for the detected faces.
        private string[] faceDescriptions;
        // The resize factor for the displayed image.
        private double resizeFactor;

        private const string defaultStatusBarText =
            "Place the mouse pointer over a face to see the face description.";
        // </snippet_mainwindow_fields>

        // <snippet_mainwindow_constructor>
        public MainWindow()
        {
            InitializeComponent();

            if (Uri.IsWellFormedUriString(faceEndpoint, UriKind.Absolute))
            {
                faceClient.Endpoint = faceEndpoint;
            }
            else
            {
                MessageBox.Show(faceEndpoint,
                    "Invalid URI", MessageBoxButton.OK, MessageBoxImage.Error);
                Environment.Exit(0);
            }
            Task.Run(async () => await TrainPeopleModel()).ConfigureAwait(false);
        }
        // </snippet_mainwindow_constructor>

        // <snippet_browsebuttonclick_start>
        // Displays the image and calls UploadAndDetectFaces.
        private void BrowseButton_Click(object sender, RoutedEventArgs e)
        {
            // Get the image file to scan from the user.
            var openDlg = new Microsoft.Win32.OpenFileDialog();

            openDlg.Filter = "JPEG Image(*.jpg)|*.jpg";
            bool? result = openDlg.ShowDialog(this);

            // Return if canceled.
            if (!(bool)result)
            {
                return;
            }

            // Display the image file.
            string filePath = openDlg.FileName;

            Uri fileUri = new Uri(filePath);
            BitmapImage bitmapSource = new BitmapImage();

            bitmapSource.BeginInit();
            bitmapSource.CacheOption = BitmapCacheOption.None;
            bitmapSource.UriSource = fileUri;
            bitmapSource.EndInit();

            FacePhoto.Source = bitmapSource;
            // </snippet_browsebuttonclick_start>

            // <snippet_browsebuttonclick_mid>
            // Detect any faces in the image.
            Title = "Detecting...";
            faceList = Task.Run(async () => await UploadAndDetectFaces(filePath).ConfigureAwait(false)).Result;
            Title = String.Format(
                "Detection Finished. {0} face(s) detected", faceList.Count);

            if (faceList.Count > 0)
            {
                // Prepare to draw rectangles around the faces.
                DrawingVisual visual = new DrawingVisual();
                DrawingContext drawingContext = visual.RenderOpen();
                drawingContext.DrawImage(bitmapSource,
                    new Rect(0, 0, bitmapSource.Width, bitmapSource.Height));
                double dpi = bitmapSource.DpiX;
                // Some images don't contain dpi info.
                resizeFactor = (dpi == 0) ? 1 : 96 / dpi;
                faceDescriptions = new String[faceList.Count];

                for (int i = 0; i < faceList.Count; ++i)
                {
                    DetectedFace face = faceList[i];

                    // Draw a rectangle on the face.
                    drawingContext.DrawRectangle(
                        Brushes.Transparent,
                        new Pen(Brushes.Red, 2),
                        new Rect(
                            face.FaceRectangle.Left * resizeFactor,
                            face.FaceRectangle.Top * resizeFactor,
                            face.FaceRectangle.Width * resizeFactor,
                            face.FaceRectangle.Height * resizeFactor
                            )
                    );

                    // Store the face description.
                    faceDescriptions[i] = FaceDescription(face, faceName);
                }

                drawingContext.Close();

                // Display the image with the rectangle around the face.
                RenderTargetBitmap faceWithRectBitmap = new RenderTargetBitmap(
                    (int)(bitmapSource.PixelWidth * resizeFactor),
                    (int)(bitmapSource.PixelHeight * resizeFactor),
                    96,
                    96,
                    PixelFormats.Pbgra32);

                faceWithRectBitmap.Render(visual);
                FacePhoto.Source = faceWithRectBitmap;

                // Set the status bar text.
                faceDescriptionStatusBar.Text = defaultStatusBarText;
            }
            // </snippet_browsebuttonclick_mid>
        // <snippet_browsebuttonclick_end>
        }
        // </snippet_browsebuttonclick_end>

        // <snippet_mousemove_start>
        // Displays the face description when the mouse is over a face rectangle.
        private void FacePhoto_MouseMove(object sender, MouseEventArgs e)
        {
            // </snippet_mousemove_start>

            // <snippet_mousemove_mid>
            // If the REST call has not completed, return.
            if (faceList == null)
                return;

            // Find the mouse position relative to the image.
            Point mouseXY = e.GetPosition(FacePhoto);

            ImageSource imageSource = FacePhoto.Source;
            BitmapSource bitmapSource = (BitmapSource)imageSource;

            // Scale adjustment between the actual size and displayed size.
            var scale = FacePhoto.ActualWidth / (bitmapSource.PixelWidth / resizeFactor);

            // Check if this mouse position is over a face rectangle.
            bool mouseOverFace = false;

            for (int i = 0; i < faceList.Count; ++i)
            {
                FaceRectangle fr = faceList[i].FaceRectangle;
                double left = fr.Left * scale;
                double top = fr.Top * scale;
                double width = fr.Width * scale;
                double height = fr.Height * scale;

                // Display the face description if the mouse is over this face rectangle.
                if (mouseXY.X >= left && mouseXY.X <= left + width &&
                    mouseXY.Y >= top && mouseXY.Y <= top + height)
                {
                    faceDescriptionStatusBar.Text = faceDescriptions[i];
                    mouseOverFace = true;
                    break;
                }
            }

            // String to display when the mouse is not over a face rectangle.
            if (!mouseOverFace) faceDescriptionStatusBar.Text = defaultStatusBarText;
            // </snippet_mousemove_mid>
        // <snippet_mousemove_end>
        }
        // </snippet_mousemove_end>

        // <snippet_uploaddetect>
        // Uploads the image file and calls DetectWithStreamAsync.
        private async Task<IList<DetectedFace>> UploadAndDetectFaces(string imageFilePath)
        {
            // The list of Face attributes to return.
            IList<FaceAttributeType> faceAttributes =
                new FaceAttributeType[]
                {
                    FaceAttributeType.Gender, FaceAttributeType.Age,
                    FaceAttributeType.Smile, FaceAttributeType.Emotion,
                    FaceAttributeType.Glasses, FaceAttributeType.Hair
                };

            // Call the Face API.
            try
            {
                using (Stream imageFileStream = File.OpenRead(imageFilePath))
                {
                    // The second argument specifies to return the faceId, while
                    // the third argument specifies not to return face landmarks.
                    IList<DetectedFace> faceList =
                        await faceClient.Face.DetectWithStreamAsync(
                            imageFileStream, true, false, faceAttributes).ConfigureAwait(false);
                
                    var faceIds = faceList.Select(face => face.FaceId.Value).ToArray();

                    var results = await faceClient.Face.IdentifyAsync(faceIds, personGroupId, null, 1, 0.5).ConfigureAwait(false);
                    foreach (var identifyResult in results)
                    {
                        Console.WriteLine("Result of face: {0}", identifyResult.FaceId);
                        if (identifyResult.Candidates.Count() == 0)
                        {
                            Console.WriteLine("No one identified");
                        }
                        else
                        {
                            // Get top 1 among all candidates returned
                            var candidateId = identifyResult.Candidates[0].PersonId;
                            var person = await faceClient.PersonGroupPerson.GetAsync(personGroupId, candidateId).ConfigureAwait(false);
                            Console.WriteLine("Identified as {0}", person.Name);
                            faceName = person.Name;
                        }
                    }
                    return faceList;
                }
            }
            // Catch and display Face API errors.
            catch (APIErrorException f)
            {
                MessageBox.Show(f.Message);
                return new List<DetectedFace>();
            }
            // Catch and display all other errors.
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "Error");
                return new List<DetectedFace>();
            }
        }
        // </snippet_uploaddetect>

        // <snippet_facedesc>
        // Creates a string out of the attributes describing the face.
        private string FaceDescription(DetectedFace face, string faceName)
        {
            StringBuilder sb = new StringBuilder();

            sb.Append("Name: ");
            sb.Append(faceName);
            sb.Append(", ");

            sb.Append("Face: ");

            // Add the gender, age, and smile.
            sb.Append(face.FaceAttributes.Gender);
            sb.Append(", ");
            sb.Append(face.FaceAttributes.Age);
            sb.Append(", ");
            sb.Append(String.Format("smile {0:F1}%, ", face.FaceAttributes.Smile * 100));

            // Add the emotions. Display all emotions over 10%.
            sb.Append("Emotion: ");
            Emotion emotionScores = face.FaceAttributes.Emotion;
            if (emotionScores.Anger >= 0.1f) sb.Append(
                String.Format("anger {0:F1}%, ", emotionScores.Anger * 100));
            if (emotionScores.Contempt >= 0.1f) sb.Append(
                String.Format("contempt {0:F1}%, ", emotionScores.Contempt * 100));
            if (emotionScores.Disgust >= 0.1f) sb.Append(
                String.Format("disgust {0:F1}%, ", emotionScores.Disgust * 100));
            if (emotionScores.Fear >= 0.1f) sb.Append(
                String.Format("fear {0:F1}%, ", emotionScores.Fear * 100));
            if (emotionScores.Happiness >= 0.1f) sb.Append(
                String.Format("happiness {0:F1}%, ", emotionScores.Happiness * 100));
            if (emotionScores.Neutral >= 0.1f) sb.Append(
                String.Format("neutral {0:F1}%, ", emotionScores.Neutral * 100));
            if (emotionScores.Sadness >= 0.1f) sb.Append(
                String.Format("sadness {0:F1}%, ", emotionScores.Sadness * 100));
            if (emotionScores.Surprise >= 0.1f) sb.Append(
                String.Format("surprise {0:F1}%, ", emotionScores.Surprise * 100));

            // Add glasses.
            sb.Append(face.FaceAttributes.Glasses);
            sb.Append(", ");

            // Add hair.
            sb.Append("Hair: ");

            // Display baldness confidence if over 1%.
            if (face.FaceAttributes.Hair.Bald >= 0.01f)
                sb.Append(String.Format("bald {0:F1}% ", face.FaceAttributes.Hair.Bald * 100));

            // Display all hair color attributes over 10%.
            IList<HairColor> hairColors = face.FaceAttributes.Hair.HairColor;
            foreach (HairColor hairColor in hairColors)
            {
                if (hairColor.Confidence >= 0.1f)
                {
                    sb.Append(hairColor.Color.ToString());
                    sb.Append(String.Format(" {0:F1}% ", hairColor.Confidence * 100));
                }
            }

            // Return the built string.
            return sb.ToString();
        }
        // </snippet_facedesc>


        private async Task TrainPeopleModel()
        {
            try
            {
                // Define Muying
                Person muying = await faceClient.PersonGroupPerson.CreateAsync(
                    // Id of the PersonGroup that the person belonged to
                    personGroupId,
                    // Name of the person
                    "Muying"
                ).ConfigureAwait(false);

                foreach (string imagePath in Directory.GetFiles(muyingImageDir, "*.jpg"))
                {
                    using (Stream s = File.OpenRead(imagePath))
                    {
                        // Detect faces in the image and add to Anna
                        await faceClient.PersonGroupPerson.AddFaceFromStreamAsync(
                            personGroupId, muying.PersonId, s).ConfigureAwait(false);
                    }
                }

                // Define Mahesh
                Person mahesh = await faceClient.PersonGroupPerson.CreateAsync(
                    // Id of the PersonGroup that the person belonged to
                    personGroupId,
                    // Name of the person
                    "Mahesh"
                ).ConfigureAwait(false);

                foreach (string imagePath in Directory.GetFiles(maheshImageDir, "*.jpg"))
                {
                    using (Stream s = File.OpenRead(imagePath))
                    {
                        // Detect faces in the image and add to Anna
                        await faceClient.PersonGroupPerson.AddFaceFromStreamAsync(
                            personGroupId, mahesh.PersonId, s).ConfigureAwait(false);
                    }
                }

                // Define Funing
                Person funing = await faceClient.PersonGroupPerson.CreateAsync(
                    // Id of the PersonGroup that the person belonged to
                    personGroupId,
                    // Name of the person
                    "Funing"
                ).ConfigureAwait(false);

                foreach (string imagePath in Directory.GetFiles(funingImageDir, "*.jpg"))
                {
                    using (Stream s = File.OpenRead(imagePath))
                    {
                        // Detect faces in the image and add to Anna
                        await faceClient.PersonGroupPerson.AddFaceFromStreamAsync(
                            personGroupId, funing.PersonId, s).ConfigureAwait(false);
                    }
                }

                // Train the PersonGroup
                await faceClient.PersonGroup.TrainAsync(personGroupId).ConfigureAwait(false);

                TrainingStatus trainingStatus = null;
                while (true)
                {
                    trainingStatus = await faceClient.PersonGroup.GetTrainingStatusAsync(personGroupId).ConfigureAwait(false);

                    if (trainingStatus.Status != TrainingStatusType.Running)
                    {
                        break;
                    }

                    await Task.Delay(3000);
                }
            }
            // Catch and display Face API errors.
            catch (APIErrorException f)
            {
                MessageBox.Show(f.Message);
            }
            // Catch and display all other errors.
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "Error");
            }
        }
    }
}
