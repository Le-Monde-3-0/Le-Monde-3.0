import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../services/article_service.dart';
import '../models/article.dart';
import '../shared/article_widget.dart';
import '../services/bookmarks_service.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ArticlesPage extends StatefulWidget {
  const ArticlesPage({Key? key}) : super(key: key);

  @override
  State<ArticlesPage> createState() => _ArticlesPageState();
}

class _ArticlesPageState extends State<ArticlesPage> {
  final ArticleService _articleService = ArticleService();
  final BookmarkService _bookmarkService = BookmarkService(client: http.Client(), storage: FlutterSecureStorage());
  String? _selectedTopic = 'À la Une';
  List<Bookmark> _bookmarks = [];

  Future<Map<String, dynamic>> _getArticle() async {
    try {
      // Appel à getAllBookmarks pour récupérer les marque-pages
      _bookmarks = await _bookmarkService.getAllBookmarks();

      var response = await _articleService.getArticle();
      List<ArticleModel> articlesList = [];
      for (var article in response) {
        articlesList.add(ArticleModel.fromJson(article));
      }

      return {'articles': articlesList, 'bookmarks': _bookmarks};
    } catch (e) {
      print(e.toString());
      return {'articles': [], 'bookmarks': []};
    }
  }

  late Future<Map<String, dynamic>> futureArticles;

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

            FutureBuilder<Map<String, dynamic>>(
              future: futureArticles,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return CircularProgressIndicator();
                } else if (snapshot.hasError) {
                  return Text('Error: ${snapshot.error}');
                } else {
                  _bookmarks = snapshot.data!['bookmarks'];
                  return Container(
                    height: 40.0,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _bookmarks.length,
                      itemBuilder: (BuildContext context, int index) {
                        return topicButton(_bookmarks[index]);
                      },
                    ),
                  );
                }
              },
            ),
            Expanded(
              child: _buildArticlesList(),
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () async {
           showDialog(
              context: context,
              builder: (BuildContext context) {
                String title = '';
                String description = '';
                return AlertDialog(
                  title: Text('Ajouter un bookmark'),
                  content: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      TextField(
                        onChanged: (value) {
                          title = value;
                        },
                        decoration: InputDecoration(
                          hintText: 'Entrez le titre du bookmark',
                        ),
                      ),
                      TextField(
                        onChanged: (value) {
                          description = value;
                        },
                        decoration: InputDecoration(
                          hintText: 'Entrez la description du bookmark',
                        ),
                      ),
                    ],
                  ),
                  actions: <Widget>[
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                      child: Text('Annuler'),
                    ),
                    TextButton(
                      onPressed: () async {
                        final bookmark = await _bookmarkService.addBookmark(title, description);
                        setState(() {
                          _bookmarks.add(bookmark);
                        });
                        Navigator.of(context).pop();
                      },
                      child: Text('Ajouter'),
                    ),
                  ],
                );
              },
            );
          },
          child: Icon(Icons.add),
        ),
      ),
    );
  }
 
 Widget topicButton(Bookmark bookmark) {
  return Row(
    children: [
      Container(
        margin: EdgeInsets.only(left: 8.0),
        child: TextButton(
          onPressed: () {
            setState(() {
              _selectedTopic = bookmark.title;
            });
          },
          child: Text(
            bookmark.title ?? '',
            style: TextStyle(
              color: _selectedTopic == bookmark.title ? Colors.black : Colors.white,
            ),
          ),
          style: TextButton.styleFrom(
            backgroundColor: _selectedTopic == bookmark.title ? Colors.red : const Color.fromARGB(255, 0, 0, 0),
            padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
            minimumSize: Size(88, 30),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(4.0),
            ),
          ),
        ),
      ),
      IconButton(
        icon: Icon(Icons.edit),
        color: Colors.white,
        onPressed: () async {
          String newTitle = bookmark.title ?? '';
          String newDescription = bookmark.description ?? '';

          await showDialog<void>(
            context: context,
            builder: (BuildContext context) {
              TextEditingController titleController = TextEditingController(text: newTitle);
              TextEditingController descriptionController = TextEditingController(text: newDescription);

              return AlertDialog(
                title: Text('Modifier le bookmark'),
                content: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: titleController,
                      onChanged: (value) {
                        newTitle = value;
                      },
                      decoration: InputDecoration(
                        hintText: 'Entrez le nouveau titre du bookmark',
                      ),
                    ),
                    TextField(
                      controller: descriptionController,
                      onChanged: (value) {
                        newDescription = value;
                      },
                      decoration: InputDecoration(
                        hintText: 'Entrez la nouvelle description du bookmark',
                      ),
                    ),
                  ],
                ),
                actions: <Widget>[
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    child: Text('Annuler'),
                  ),
                  TextButton(
                    onPressed: () async {
                      Bookmark updatedBookmark = await _bookmarkService.updateBookmark(bookmark.id!, newTitle, newDescription);
                      setState(() {
                        int index = _bookmarks.indexWhere((bm) => bm.id == bookmark.id);
                        _bookmarks[index] = updatedBookmark;
                      });
                      Navigator.of(context).pop();
                    },
                    child: Text('Enregistrer'),
                  ),
                ],
              );
            },
          );
        },
      ),
      IconButton(
        icon: Icon(Icons.delete),
        color: Colors.white,
        onPressed: () async {
          await _bookmarkService.deleteBookmark(bookmark.id!);
          setState(() {
            _bookmarks.removeWhere((bm) => bm.id == bookmark.id);
          });
        },
      ),
    ],
  );
}


  Widget _buildArticlesList() {
    return FutureBuilder<Map<String, dynamic>>(
      future: futureArticles,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Erreur: ${snapshot.error}'));
        } else if (snapshot.data!['articles'].isEmpty) {
          return Center(child: Text('Aucun article disponible.'));
        } else {
          List<ArticleModel> myObjects = snapshot.data!['articles'];
          _bookmarks = snapshot.data!['bookmarks'];
          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  itemCount: myObjects.length,
                  itemBuilder: (context, index) {
                    return ArticleWidget(
                      article: myObjects[index]
                    );
                  },
                ),
              ),
            ],
          );
        }
      },
    );
  }
}
