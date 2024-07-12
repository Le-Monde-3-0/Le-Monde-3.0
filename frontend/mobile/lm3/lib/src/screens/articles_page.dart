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
  List<ArticleModel> _selectedBookmarkArticles = [];
  bool _showArticles = false;
 late Future<Map<String, List<ArticleModel>>> futureArticles;

  @override
  void initState() {
    super.initState();
    futureArticles = _getArticle(null);
    _filteredBookmarks = _bookmarks;
  }

Future<Map<String, List<ArticleModel>>> _getArticle(Bookmark? selectedBookmark) async {
  try {
    _bookmarks = await _bookmarkService.getAllBookmarks();
    _filteredBookmarks = _bookmarks;

    var response = await _articleService.getArticle();
    List<ArticleModel> articlesList = [];
    for (var article in response) {
      ArticleModel articleModel = ArticleModel.fromJson(article);
      articlesList.add(articleModel);
      print(articleModel.title);
    }

    if (selectedBookmark != null) {
       List<dynamic> selectedBookmarkArticles = await _bookmarkService.getArticlesFromBookmark(selectedBookmark.id!);
       _selectedBookmarkArticles = selectedBookmarkArticles.map((article) => ArticleModel.fromJson(article)).toList();
    } else {
      _selectedBookmarkArticles = articlesList;
    }

   return {'articles': articlesList, 'bookmarks': []};
  } catch (e) {
    print(e.toString());
    return {'articles': [], 'bookmarks': []};
  }
}

  Widget topicButton(Bookmark bookmark) {
    return Row(
      children: [
        Container(
          margin: EdgeInsets.only(left: 8.0),
          child: GestureDetector(
            onLongPress: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    title: Text("Options"),
                    content: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        IconButton(
                          icon: Icon(Icons.delete),
                          color: Colors.red,
                          onPressed: () async {
                            await _bookmarkService.deleteBookmark(bookmark.id!);
                            setState(() {
                              _bookmarks.removeWhere((bm) => bm.id == bookmark.id);
                              _filteredBookmarks = _bookmarks;
                              if (selectedBookmark?.id == bookmark.id) {
                                selectedBookmark = null;
                              }
                            });
                            Navigator.of(context).pop();
                          },
                        ),
                        IconButton(
                          icon: Icon(Icons.edit),
                          color: Colors.blue[900],
                          onPressed: () async {
                            Navigator.of(context).pop();
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
                                      Text('Modifier le signet', style: TextStyle(color: Colors.black)),
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
                                          hintText: 'Entrez le nouveau titre du signet',
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
                                          hintText: 'Entrez la nouvelle description du signet',
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
                                        backgroundColor: Colors.lightBlue[300],
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(8.0),
                                        ),
                                        elevation: 2.0,
                                      ),
                                    ),
                                  ],
                                );
                              },
                            );
                          },
                        ),
                      ],
                    ),
                  );
                },
              );
            },
            child: TextButton(
              onPressed: () async {
                setState(() {
                  _selectedTopic = bookmark.title ?? '';
                  _selectedBookmark = bookmark;
                  _showArticles = true;
                });
                futureArticles = _getArticle(bookmark);
           
                

               List<dynamic> articles = await _bookmarkService.getArticlesFromBookmark(bookmark.id!);
                  print("Nombre d'articles : ${articles.length}");
                  for (var article in articles) {
                  print(article['title'] ?? 'Titre non disponible');
                  print("test ligne 207");
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
        ),
      ],
    );
  }

Widget _buildArticlesList() {
    return FutureBuilder<Map<String, List<ArticleModel>>>(
      future: futureArticles,
      builder: (context, snapshot) {
        print("Snapshot connection state: ${snapshot.connectionState}");
        print("Snapshot has error: ${snapshot.hasError}");
        print("Snapshot error: ${snapshot.error}");

        if (!_showArticles) {
          return Container();
        }
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Erreur au niveau du: ${snapshot.error}'));
        } else {
          List<ArticleModel> selectedArticles = [];
          if (_selectedBookmark != null) {
            selectedArticles = _selectedBookmarkArticles;
          } else {
            selectedArticles = snapshot.data!['articles']!;
          }

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
                            builder: (context) => ArticleDetailPage(article: Articleinbookmark.fromArticleModel(selectedArticles[index])),
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
                      Text('Ajouter un signet', style: TextStyle(color: Colors.grey[800])),
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
                          hintText: 'Entrez le titre du signet',
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
                          hintText: 'Entrez la description du signet',
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

class Articleinbookmark extends ArticleModel {
  Articleinbookmark({
    required int id,
    required String title,
    required String content,
    required DateTime createdAt,
    required DateTime updatedAt,
    required int userId,
    required String authorName,
    required String subtitle,
    required String topic,
    required bool draft,
    int? likes,
  }) : super(
          id: id,
          title: title,
          content: content,
          createdAt: createdAt,
          updatedAt: updatedAt,
          userId: userId,
          authorName: authorName,
          subtitle: subtitle,
          topic: topic,
          draft: draft,
          likes: likes != null ? [likes] : [],
        );

  factory Articleinbookmark.fromArticleModel(ArticleModel articleModel) {
    return Articleinbookmark(
      id: articleModel.id,
      title: articleModel.title,
      content: articleModel.content,
      createdAt: articleModel.createdAt,
      updatedAt: articleModel.updatedAt,
      userId: articleModel.userId,
      authorName: articleModel.authorName,
      subtitle: articleModel.subtitle,
      topic: articleModel.topic,
      draft: articleModel.draft,
      likes: articleModel.likes.isNotEmpty ? articleModel.likes[0] : null,
    );
  }
}