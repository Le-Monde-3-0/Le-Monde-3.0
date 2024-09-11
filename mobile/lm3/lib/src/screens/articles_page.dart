import 'package:flutter/material.dart';
import 'dart:convert';

import '../services/Article_service.dart';
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
  
  Future<List<ArticleModel>> _getArticles() async {
    try {
      var response = await _articleService.getArticles();
      return response;
    } catch (e) {
      throw Exception('erreur lors du chargement des articles');
    }
  }

  late Future<List<ArticleModel>> futureArticles;
  @override
  void initState() {
    super.initState();
    futureArticles = _getArticles();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: Color.fromARGB(255, 16, 16, 16)
      ),
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Le Monde 3.0', style: TextStyle(fontFamily: 'LeMonde', fontSize: 30.0, fontWeight: FontWeight.bold, color: Colors.white)),
        ),
        body: Column(
          children: [
          SizedBox(width: 1106.0),
          Container(
              height: 40.0,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: <Widget>[
                  editTopicButton(),
                  topicButton('À la Une'),
                  Container(
                    margin: EdgeInsets.symmetric(horizontal: 8.0),
                    child: const Text('|', style: TextStyle(color: Colors.white, fontSize: 24)),
                  ),
                  topicButton('Société'),
                  topicButton('Sport'),
                  topicButton('Politique'),
                  topicButton('Économie'),
                  topicButton('Géo-politique'),
                  topicButton('Culture'),
                  topicButton('Science'),
                  topicButton('Livres'),
                  topicButton('Par Pays'),
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
          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                futureArticles = _getArticles();
              });
            },
            child: ListView.builder(
              itemCount: myObjects.length,
              itemBuilder: (context, index) {
                return ArticleWidget(article: myObjects[index]);
              },
            ),
          );
        }
      },
    );
  }

}