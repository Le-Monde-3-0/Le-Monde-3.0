import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../services/Article_service.dart';
import '../services/Topic_service.dart';
import '../models/article.dart';
import '../models/topic.dart';
import '../shared/article_widget.dart';

// BLOC
import '../bloc/user/user_bloc.dart';
import '../bloc/user/user_state.dart';

class ArticlesPage extends StatefulWidget {
  const ArticlesPage({super.key});

  @override
  State<ArticlesPage> createState() => _ArticlesPageState();
}

class _ArticlesPageState extends State<ArticlesPage> {
  late final ArticleService _articleService;
  late final TopicService _topicService;
  late Future<List<ArticleModel>> _articles;
  late Future<List<TopicModel>> _topics;
  String _selectedTopic = 'À la Une';
  int? _selectedTopicId;

  int _currentPage = 1;
  final int _articlesPerPage = 10;
  int _totalPages = 1;

  @override
  void initState() {
    super.initState();
    final userBloc = BlocProvider.of<UserBloc>(context);
    _articleService = ArticleService(userBloc: userBloc);
    _topicService = TopicService(userBloc: userBloc);
    _articles = _articleService.getArticles();
    _topics = _topicService.getTopics();
  }

  List<Widget> _buildTopicButtons(List<TopicModel> topics) {
    List<Widget> topicButtons = topics.map((topic) {
      return topicButton(topic.name, topic.id);
    }).toList();

    return [
      Container(
        margin: EdgeInsets.symmetric(horizontal: 8.0),
        child: const Text('|', style: TextStyle(color: Colors.white, fontSize: 24)),
      ),
      topicButton('À la Une', null),
      ...topicButtons,
    ];
  }

  void _calculateTotalPages(List<ArticleModel> articles) {
      _totalPages = (articles.length / _articlesPerPage).ceil();
  }

  List<ArticleModel> _getArticlesForPage(List<ArticleModel> articles) {
    final startIndex = (_currentPage - 1) * _articlesPerPage;
    final endIndex = startIndex + _articlesPerPage;
    return articles.sublist(startIndex, endIndex > articles.length ? articles.length : endIndex);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<UserBloc, UserState>(
        builder: (context, state) {
          if (state is UserLoading) {
            return Center(child: CircularProgressIndicator());
          } else if (state is UserLoaded) {
            return Column(
              children: [
                FutureBuilder<List<TopicModel>>(
                  future: _topics,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return Center(child: CircularProgressIndicator());
                    } else if (snapshot.hasError) {
                      return Center(child: Text('Erreur: ${snapshot.error}'));
                    } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                      return Center(child: Text('Aucun topic disponible.'));
                    } else {
                      return Container(
                        height: 40.0,
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          children: <Widget>[
                            editTopicButton(),
                            ..._buildTopicButtons(snapshot.data!)
                          ],
                        ),
                      );
                    }
                  },
                ),
                Expanded(
                  child: _buildArticlesList(),
                ),
                _buildPaginationBar(),
              ],
            );
          } else if (state is UserError) {
            return Center(child: Text('Erreur: ${state.message}'));
          } else {
            return Center(child: Text('Bienvenue sur Le Monde 3.0'));
          }
        },
      ),
    );
  }

  Widget topicButton(String title, int? topicId) {
    _currentPage = 1;
    return Container(
      margin: EdgeInsets.only(left: 8.0),
      child: TextButton(
        onPressed: () {
          setState(() {
            _selectedTopic = title;
            _selectedTopicId = topicId;
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

  Widget _buildArticlesList() {
    return FutureBuilder<List<ArticleModel>>(
      future: _articles,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Erreur: ${snapshot.error}'));
        } else if (snapshot.data!.isEmpty) {
          return Center(child: Text('Aucun article disponible.'));
        } else {
          List<ArticleModel> articles = snapshot.data!;
          if (_selectedTopicId != null) {
            articles = articles.where((article) => article.topicId == _selectedTopicId).toList();
          }
          _calculateTotalPages(articles);
          List<ArticleModel> currentArticles = _getArticlesForPage(articles);
          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                _articles = _articleService.getArticles();
              });
            },
            child: ListView.builder(
              itemCount: currentArticles.length,
              itemBuilder: (context, index) {
                return ArticleWidget(article: currentArticles[index]);
              },
            ),
          );
        }
      },
    );
  }

  Widget _buildPaginationBar() {
    List<Widget> pageButtons = [];
    for (int i = 1; i <= _totalPages; i++) {
      pageButtons.add(
        TextButton(
          onPressed: () {
            setState(() {
              _currentPage = i;
            });
          },
          child: Text(
            i.toString(),
            style: TextStyle(
              color: _currentPage == i ? Colors.black : Colors.white,
            ),
          ),
          style: TextButton.styleFrom(
            backgroundColor: _currentPage == i ? Colors.white : const Color.fromARGB(255, 0, 0, 0),
          ),
        ),
      );
    }

    return Container(
      padding: EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: pageButtons,
      ),
    );
  }

  Widget editTopicButton() {
    return Container(
      margin: EdgeInsets.only(left: 8.0),
      child: TextButton(
        onPressed: () {},
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
}
