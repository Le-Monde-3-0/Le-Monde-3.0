import 'package:flutter/material.dart';
import 'dart:convert';

import '../services/article_service.dart';
import '../models/article.dart';
import '../shared/article_widget.dart';

class ArticlesPage extends StatefulWidget {
  const ArticlesPage({super.key});

  @override
  State<ArticlesPage> createState() => _ArticlesPageState();
}

class _ArticlesPageState extends State<ArticlesPage> {
  final ArticleService _articleService = ArticleService();
  String _selectedTopic = 'À la Une';
  
  Future<List<ArticleModel>> _getArticle() async {
    try {
      var response = await _articleService.getArticle();
      Iterable jsonResponse = response;
      // List<ArticleModel> articlesList = jsonResponse.map((model) => ArticleModel.fromJson(model)).toList();
      //faire la meme chose que la ligne ci-dessus mais reverse la liste
      List<ArticleModel> articlesList = [];
      for (var article in jsonResponse) {
        articlesList.insert(0, ArticleModel.fromJson(article));
      }


      return articlesList;
    } catch (e) {
      print(e.toString());
      return [];
    }
  }

  late Future<List<ArticleModel>> futureArticles;

  @override
  void initState() {
    super.initState();
    futureArticles = _getArticle();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark(),
      home: Scaffold(
        appBar: AppBar(
          title: Text('Le Monde 3.0', style: TextStyle(fontFamily: 'LeMonde', fontSize: 30.0, fontWeight: FontWeight.bold, color: Colors.white)),
        ),
        body: Column(
          children: [
          SizedBox(width: 1106.0),
            //TDOD ajouter un barre de recherche

          Container(
              height: 40.0,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: <Widget>[
                  editTopicButton(),
                  topicButton('À la Une'),
                  Container(
                    margin: EdgeInsets.symmetric(horizontal: 8.0),
                    child: Text('|', style: TextStyle(color: Colors.white, fontSize: 24)),
                  ),
                  topicButton('Politique'),
                  topicButton('Géo-politique'),
                  topicButton('Société'),
                  topicButton('Par Pays'),
                  topicButton('Économie'),
                  topicButton('Culture'),
                  topicButton('Sport'),
                  topicButton('Science'),
                  topicButton('Livres'),
                ],
              ),
            ),
            Expanded(
              child: _buildArticlesList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget topicButton(String title) {
    return Container(
      margin: EdgeInsets.only(left: 8.0),
      child: TextButton(
        onPressed: () {
          setState(() {
            _selectedTopic = title;
          });
        },
        child: Text(
          title,
          style: TextStyle(
            color: _selectedTopic == title ? Colors.black : Colors.white,
          ),
        ),
        style: TextButton.styleFrom(
          backgroundColor: _selectedTopic == title ? Colors.white : const Color.fromARGB(255, 0, 0, 0),
          padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
          minimumSize: Size(88, 30),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(4.0),
          ),
        ),
      ),
    );
  }

  Widget editTopicButton() {
    return Container(
      margin: EdgeInsets.only(left: 8.0),
      child: TextButton(
        onPressed: () {

        },
        child: Text(
          '+',
          style: TextStyle(
            color: const Color.fromARGB(255, 12, 12, 12),
          ),
        ),
        style: TextButton.styleFrom(
          backgroundColor: Colors.yellowAccent[700], 
          padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
          fixedSize: Size(58, 30),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25.0),
          ),
        ),
      ),
    );
  }


  Widget _buildArticlesList() {
    return FutureBuilder<List<ArticleModel>>(
      future: futureArticles,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Erreur: ${snapshot.error}'));
        } else if (snapshot.data!.isEmpty) {
          return Center(child: Text('Aucun article disponible.'));
        } else {
          List<ArticleModel> myObjects = snapshot.data ?? [];
          return ListView.builder(
            itemCount: myObjects.length,
            itemBuilder: (context, index) {
              return ArticleWidget(article: myObjects[index]);
            },
          );
        }
      },
    );
  }
}