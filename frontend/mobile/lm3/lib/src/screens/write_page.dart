import 'package:flutter/material.dart';
// import '../services/article_service.dart';
import '../shared/article_page_previsual.dart';
import '../models/article.dart';

class WritePage extends StatefulWidget {
  const WritePage({super.key});
  @override
  _WritePageState createState() => _WritePageState();
}

class _WritePageState extends State<WritePage> {
  final _formKey = GlobalKey<FormState>();
  // final ArticleService _articleService = ArticleService();

  final _articleTitle = TextEditingController();
  final _articleTheme = TextEditingController();
  final _articleContent = TextEditingController();

  // void _submitArticle(bool draft) async {
  //   try {
  //     if (_formKey.currentState!.validate()) {
  //       _formKey.currentState!.save();
  //       var result = await _articleService.createArticle("@moi", _articleContent.text, "subtile", _articleTitle.text, _articleTheme.text, draft);
  //       print(result);
  //     }
  //   } catch (e) {
  //     print(e.toString());
  //   }
  // }
  
  @override
  Widget build(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      appBar: AppBar(
        title: Text('Création d\'un Article'),
      ),
      body: SingleChildScrollView( // Ajout du SingleChildScrollView
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Titre de l\'article',
                    labelStyle: TextStyle(color: Colors.blueGrey), // Couleur du texte de l'étiquette
                    fillColor: Colors.white, // Couleur de fond du champ
                    filled: true, // Activer la couleur de fond
                    border: OutlineInputBorder( // Bordure extérieure
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: BorderSide(color: Colors.blueGrey),
                    ),
                    focusedBorder: OutlineInputBorder( // Bordure lorsque le champ est sélectionné
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: BorderSide(color: Colors.blue, width: 2.0),
                    ),
                    errorBorder: OutlineInputBorder( // Bordure en cas d'erreur
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: BorderSide(color: Colors.red, width: 2.0),
                    ),
                    prefixIcon: Icon(Icons.title, color: Colors.blueGrey), // Icône de préfixe
                    suffixIcon: Icon(Icons.edit, color: Colors.blueGrey), // Icône de suffixe
                  ),
                  validator: (value) => value!.isEmpty ? 'Ce champ est obligatoire' : null,
                  // onSaved: (value) => _articleTitle = value,
                  controller: _articleTitle,
                ),
                SizedBox(height: 16.0),
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Theme de l\'article',
                    labelStyle: TextStyle(color: Colors.blueGrey), // Couleur du texte de l'étiquette
                    fillColor: Colors.white, // Couleur de fond du champ
                    filled: true, // Activer la couleur de fond
                    border: OutlineInputBorder( // Bordure extérieure
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: BorderSide(color: Colors.blueGrey),
                    ),
                    focusedBorder: OutlineInputBorder( // Bordure lorsque le champ est sélectionné
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: BorderSide(color: Colors.blue, width: 2.0),
                    ),
                    errorBorder: OutlineInputBorder( // Bordure en cas d'erreur
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: BorderSide(color: Colors.red, width: 2.0),
                    ),
                    prefixIcon: Icon(Icons.title, color: Colors.blueGrey), // Icône de préfixe
                    suffixIcon: Icon(Icons.edit, color: Colors.blueGrey), // Icône de suffixe
                  ),
                  validator: (value) => value!.isEmpty ? 'Ce champ est obligatoire' : null,
                  // onSaved: (value) => _articleTheme = value,
                  controller: _articleTheme,

                ),
                SizedBox(height: 16.0),
                ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: screenHeight / 2,
                  ),
                  child: Container(
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8.0),
                      child: TextFormField(
                        decoration: InputDecoration(
                          labelText: 'Contenu de l\'article',
                          labelStyle: TextStyle(color: Colors.blueGrey),
                          enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: Colors.blueGrey, width: 1.0),
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: const Color.fromARGB(255, 243, 201, 33), width: 2.0),

                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          fillColor: Colors.white,
                          filled: true,
                        ),
                        keyboardType: TextInputType.multiline,
                        maxLines: null,
                        validator: (value) => value!.isEmpty ? 'Ce champ est obligatoire' : null,
                        controller: _articleContent,

                      ),
                    ),
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      var article = ArticleModel(
                        id: 1,
                        createdAt: DateTime.now(),
                        updatedAt: DateTime.now(),
                        userId: 1,
                        authorName: "moi",
                        title: _articleTitle.text,
                        subtitle: "subtile",
                        content: _articleContent.text,
                        topic: _articleTheme.text,
                        draft: false,
                        likes: [],
                      );
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => ArticleDetailPrevisuPage(article: article),
                        ),
                      );
                    }
                  },
                  icon: Icon(Icons.arrow_forward),
                  label: const Text('Suivant'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(255, 112, 243, 121),
                    foregroundColor: Colors.white, // Texte en blanc
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                    textStyle: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),

              ],
            ),
          ),
        ),
      ),
    );
  }
}