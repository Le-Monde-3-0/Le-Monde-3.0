import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../services/article_service.dart';
import '../models/article.dart';
import '../shared/article_widget.dart';
import '../services/bookmarks_service.dart';

class ArticlesPage extends StatefulWidget {
  const ArticlesPage({Key? key}) : super(key: key);

  @override
  State<ArticlesPage> createState() => _ArticlesPageState();
}

class _ArticlesPageState extends State<ArticlesPage> {
  final ArticleService _articleService = ArticleService();
  final BookmarkService _bookmarkService = BookmarkService(client: http.Client(), storage: FlutterSecureStorage());
  String? _selectedTopic = 'À la Une';
  Bookmark? selectedBookmark;
  List<Bookmark> _bookmarks = [];
  List<Bookmark> _filteredBookmarks = [];
  Bookmark? _selectedBookmark;
  List<dynamic> _selectedBookmarkArticles = [];
  bool _showArticles = false;

  Future<Map<String, dynamic>> _getArticle(Bookmark? selectedBookmark) async {
    try {
      _bookmarks = await _bookmarkService.getAllBookmarks();
      _filteredBookmarks = _bookmarks;

      var response = await _articleService.getArticle();
      List<ArticleModel> articlesList = [];
      for (var article in response) {
        articlesList.add(ArticleModel.fromJson(article));
      }

      if (selectedBookmark != null) {
        _selectedBookmarkArticles = await _bookmarkService.getArticlesFromBookmark(selectedBookmark.id!);
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
    futureArticles = _getArticle(null);
    _filteredBookmarks = _bookmarks;
  }

  Widget topicButton(Bookmark bookmark) {
    return Row(
      children: [
        Container(
          margin: EdgeInsets.only(left: 8.0),
          child: TextButton(
            onPressed: () async {
              setState(() {
                _selectedTopic = bookmark.title ?? '';
                _selectedBookmark = bookmark;
                _showArticles = true;
              });
              futureArticles = _getArticle(bookmark);

              List<dynamic> articles = await _bookmarkService.getArticlesFromBookmark(bookmark.id!);
              for (var article in articles) {
                print(article['title'] ?? '');
              }
            },
            child: Text(
              bookmark.title ?? '',
              style: TextStyle(
                color: _selectedTopic == bookmark.title ? Colors.black : Colors.white,
              ),
            ),
            style: TextButton.styleFrom(
              backgroundColor: _selectedTopic == bookmark.title ? Colors.red : Colors.grey[800],
              padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
              minimumSize: Size(88, 30),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16.0),
              ),
            ),
          ),
        ),
        IconButton(
          icon: Icon(Icons.edit),
          color: Colors.grey[800],
          onPressed: () async {
            String newTitle = bookmark.title ?? '';
            String newDescription = bookmark.description ?? '';

            await showDialog<void>(
              context: context,
              builder: (BuildContext context) {
                TextEditingController titleController = TextEditingController(text: newTitle);
                TextEditingController descriptionController = TextEditingController(text: newDescription);

                return AlertDialog(
                  backgroundColor: Colors.grey[200],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                  title: Row(
                    children: [
                      Icon(Icons.bookmark, color: Colors.grey[800]),
                      SizedBox(width: 8.0),
                      Text('Modifier le bookmark', style: TextStyle(color: Colors.black)),
                    ],
                  ),
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
                          prefixIcon: Icon(Icons.title, color: Colors.grey[800]),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          hintStyle: TextStyle(color: Colors.black),
                        ),
                        style: TextStyle(
                          color: Colors.black),
                      ),
                      SizedBox(height: 16.0),
                      TextField(
                        controller: descriptionController,
                        onChanged: (value) {
                          newDescription = value;
                        },
                        decoration: InputDecoration(
                          hintText: 'Entrez la nouvelle description du bookmark',
                          prefixIcon: Icon(Icons.description, color: Colors.black),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          hintStyle: TextStyle(color: Colors.black),
                        ),
                        style: TextStyle(
                          color: Colors.black),
                      ),
                    ],
                  ),
                  actions: <Widget>[
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                      child: Text('Annuler', style: TextStyle(color: Colors.grey[800])),
                    ),
                    TextButton(
                      onPressed: () async {
                        Bookmark updatedBookmark = await _bookmarkService.updateBookmark(bookmark.id!, newTitle, newDescription);
                        setState(() {
                          int index = _bookmarks.indexWhere((bm) => bm.id == bookmark.id);
                          _bookmarks[index] = updatedBookmark;
                          _filteredBookmarks = _bookmarks;
                          if (selectedBookmark?.id == bookmark.id) {
                            selectedBookmark = updatedBookmark;
                          }
                        });
                        Navigator.of(context).pop();
                      },
                      child: Text('Enregistrer', style: TextStyle(color: Colors.white)),
                      style: TextButton.styleFrom(
                        backgroundColor: Colors.red,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                      ),
                    ),
                  ],
                );
              },
            );
          },
        ),
        IconButton(
          icon: Icon(Icons.delete),
          color: Colors.grey[800],
          onPressed: () async {
            await _bookmarkService.deleteBookmark(bookmark.id!);
            setState(() {
              _bookmarks.removeWhere((bm) => bm.id == bookmark.id);
              _filteredBookmarks = _bookmarks;
              if (selectedBookmark?.id == bookmark.id) {
                selectedBookmark = null;
              }
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
        if (!_showArticles) {
          return Container();
        }
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Erreur: ${snapshot.error}'));
        } else if (snapshot.data!['articles'] == null || snapshot.data!['articles'].isEmpty) {
          return Center(child: Text('Aucun article disponible.'));
        } else {
          List<Articleinbookmark> selectedArticles = [];
          if (_selectedBookmark != null) {
            selectedArticles = _selectedBookmarkArticles.map((article) => Articleinbookmark.fromJson(article)).toList();
          } else {
            selectedArticles = snapshot.data!['articles'];
          }

          if (selectedArticles.isEmpty) {
            return Center(child: Text('Aucun article disponible pour ce bookmark.'));
          } else {
            return Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: selectedArticles.length,
                    itemBuilder: (context, index) {
                      return GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ArticleDetailPage(article: selectedArticles[index]),
                            ),
                          );
                        },
                        child: ArticleWidget(
                          article: selectedArticles[index],
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          }
        }
      },
    );
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
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextField(
                onChanged: (value) {
                  setState(() {
                    _filteredBookmarks = _bookmarks
                        .where((bookmark) =>
                            bookmark.title?.toLowerCase().contains(value.toLowerCase()) ?? false)
                        .toList();
                  });
                },
                decoration: InputDecoration(
                  hintText: 'Rechercher un signet',
                  prefixIcon: Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                ),
              ),
            ),
            SizedBox(height: 16.0),
            Container(
              height: 40.0,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _filteredBookmarks.length,
                itemBuilder: (BuildContext context, int index) {
                  return topicButton(_filteredBookmarks[index]);
                },
              ),
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
                  backgroundColor: Colors.grey[200],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                  title: Row(
                    children: [
                      Icon(Icons.bookmark, color: Colors.grey[800]),
                      SizedBox(width: 8.0),
                      Text('Ajouter un bookmark', style: TextStyle(color: Colors.grey[800])),
                    ],
                  ),
                  content: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      TextField(
                        onChanged: (value) {
                          title = value;
                        },
                        decoration: InputDecoration(
                          hintText: 'Entrez le titre du bookmark',
                          prefixIcon: Icon(Icons.title, color: Colors.grey[800]),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          hintStyle:  TextStyle(color: Colors.black),
                        ),
                        style: TextStyle(
                          color: Colors.black),
                      ),
                      SizedBox(height: 16.0),
                      TextField(
                        onChanged: (value) {
                          description = value;
                        },
                        decoration: InputDecoration(
                          hintText: 'Entrez la description du bookmark',
                          prefixIcon: Icon(Icons.description, color: Colors.black),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          hintStyle: TextStyle(color: Colors.black),
                        ),
                        style: TextStyle(
                          color: Colors.black),
                      ),
                    ],
                  ),
                  actions: <Widget>[
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                      child: Text('Annuler', style: TextStyle(color: Colors.grey[800])),
                    ),
                    TextButton(
                      onPressed: () async {
                        final bookmark = await _bookmarkService.addBookmark(title, description);
                        setState(() {
                          _bookmarks.add(bookmark);
                          _filteredBookmarks = _bookmarks;
                          selectedBookmark = bookmark;
                        });
                        Navigator.of(context).pop();
                      },
                      child: Text('Ajouter', style: TextStyle(color: Colors.white)),
                      style: TextButton.styleFrom(
                        backgroundColor: Colors.red,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                      ),
                    ),
                  ],
                );
              },
            );
          },
          child: Icon(Icons.add),
          backgroundColor: Colors.red,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16.0),
          ),
        ),
      ),
    );
  }
}

class ArticleDetailPage extends StatelessWidget {
  final Articleinbookmark article;

  ArticleDetailPage({required this.article});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(article.title),
        backgroundColor: Colors.grey[800],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Text(article.content),
      ),
    );
  }
}
