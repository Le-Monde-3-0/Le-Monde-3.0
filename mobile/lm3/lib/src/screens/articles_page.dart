import 'package:flutter/material.dart';
import 'package:lm3/src/models/bookmark.dart';
import 'dart:convert';

import '../services/Article_service.dart';
import '../models/article.dart';
import '../shared/article_widget.dart';
import '../services/bookmark_service.dart';

class ArticlesPage extends StatefulWidget {
  const ArticlesPage({super.key});

  @override
  State<ArticlesPage> createState() => _ArticlesPageState();
}

class _ArticlesPageState extends State<ArticlesPage> {
  final ArticleService _articleService = ArticleService();
  final BookmarkService _bookmarkService = BookmarkService();
  
  List<Bookmark> _bookmarks = [];
  String _selectedTopic = '';
  late Future<List<ArticleModel>> futureArticles;

  @override
  void initState() {
    super.initState();
    _loadBookmarks(); // Charger les bookmarks au démarrage
    futureArticles = _getArticles(); // Charger les articles au démarrage
  }

  // Charger les bookmarks depuis l'API
  Future<void> _loadBookmarks() async {
    try {
      var bookmarks = await _bookmarkService.getAllBookmarks();
      setState(() {
        _bookmarks = bookmarks;
        _selectedTopic = _bookmarks.isNotEmpty ? _bookmarks[0].title ?? '' : '';
      });
    } catch (e) {
      print('Erreur lors du chargement des topics: $e');
    }
  }

  // Charger les articles depuis l'API
  Future<List<ArticleModel>> _getArticles() async {
    try {
      return await _articleService.getArticles(); // Filtrer par topic si besoin
    } catch (e) {
      throw Exception('Erreur lors du chargement des articles');
    }
  }

  // Construire les boutons de topics dynamiquement
  Widget _buildTopicsList() {
    return ListView(
      scrollDirection: Axis.horizontal,
      children: [
        editTopicButton(), // Bouton pour ajouter un topic
        for (var bookmark in _bookmarks)
          topicButton(bookmark.title ?? ''),
      ],
    );
  }

  // Bouton de topic
  Widget topicButton(String title) {
    return Container(
      margin: EdgeInsets.only(left: 8.0),
      child: TextButton(
        onPressed: () {
          setState(() {
            _selectedTopic = title;
            futureArticles = _getArticles(); // Recharger les articles pour ce topic
          });
        },
        child: Text(
          title,
          style: TextStyle(
            color: _selectedTopic == title ? Colors.black : Colors.white,
          ),
        ),
        style: TextButton.styleFrom(
          backgroundColor: _selectedTopic == title ? Colors.white : Colors.black,
          padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
        ),
      ),
    );
  }

  // Bouton pour éditer et ajouter des topics
  Widget editTopicButton() {
    return Container(
      margin: EdgeInsets.only(left: 8.0),
      child: TextButton(
        onPressed: () {
          _showAddTopicDialog(); // Ouvrir un dialogue pour ajouter un topic
        },
        child: Text(
          '+',
          style: TextStyle(color: Colors.black),
        ),
        style: TextButton.styleFrom(
          backgroundColor: Colors.yellowAccent[700],
          padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
          fixedSize: Size(58, 30),
        ),
      ),
    );
  }

  // Dialog pour ajouter un nouveau topic
  void _showAddTopicDialog() {
    String title = '';
    String description = '';

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Ajouter un topic'),
          content: Column(
            children: [
              TextField(
                onChanged: (value) {
                  title = value;
                },
                decoration: InputDecoration(labelText: 'Titre du topic'),
              ),
              TextField(
                onChanged: (value) {
                  description = value;
                },
                decoration: InputDecoration(labelText: 'Description'),
              ),
            ],
          ),
          actions: [
            TextButton(
              child: Text('Annuler'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Ajouter'),
              onPressed: () async {
                await _bookmarkService.createBookmark(title, description);
                _loadBookmarks(); // Recharger les bookmarks après l'ajout
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  // Construction de la liste des articles
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

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: Color.fromARGB(255, 16, 16, 16),
      ),
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Le Monde 3.0', style: TextStyle(fontSize: 30.0, fontWeight: FontWeight.bold)),
        ),
        body: Column(
          children: [
            Container(
              height: 40.0,
              child: _buildTopicsList(), // Affichage dynamique des topics
            ),
            Expanded(
              child: _buildArticlesList(),
            ),
          ],
        ),
      ),
    );
  }
}
