import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../services/article_service.dart';
import '../models/article.dart';
import '../shared/article_widget.dart';

// BLOC
import '../bloc/user/user_bloc.dart';
import '../bloc/user/user_state.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  late final ArticleService _articleService;
  late Future<List<ArticleModel>> futureArticles;
  List<ArticleModel> filteredArticles = [];
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    final userBloc = BlocProvider.of<UserBloc>(context);
    _articleService = ArticleService(userBloc: userBloc);
    futureArticles = _getArticles();
  }

  Future<List<ArticleModel>> _getArticles() async {
    try {
      var response = await _articleService.getArticles();
      filteredArticles = response;
      return response;
    } catch (e) {
      throw Exception('Erreur lors du chargement des articles');
    }
  }

  void _filterArticles(String query) {
    setState(() {
      _searchQuery = query.toLowerCase();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Container(
          margin: EdgeInsets.only(top: 10),
          child: TextField(
            onChanged: (query) {
              _filterArticles(query);
            },
            decoration: InputDecoration(
              hintText: 'Rechercher des articles...',
              hintStyle: TextStyle(color: Colors.white70),
              border: InputBorder.none,
            ),
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
      body: BlocBuilder<UserBloc, UserState>(
        builder: (context, state) {
          if (state is UserLoading) {
            return Center(child: CircularProgressIndicator());
          } else if (state is UserLoaded) {
            return Expanded(
              child: _buildArticlesList(),
            );
          } else if (state is UserError) {
            return Center(child: Text('Erreur: ${state.message}'));
          } else {
            return Center(child: Text('Bienvenue sur Anthologia'));
          }
        },
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
          List<ArticleModel> articles = snapshot.data ?? [];
          filteredArticles = articles.where((article) {
            final titleLower = article.title.toLowerCase();
            final subtitleLower = article.subtitle?.toLowerCase() ?? '';
            final contentLower = article.content.toLowerCase();
            return titleLower.contains(_searchQuery) ||
                subtitleLower.contains(_searchQuery) ||
                contentLower.contains(_searchQuery);
          }).toList();

          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                futureArticles = _getArticles();
              });
            },
            child: ListView.builder(
              itemCount: filteredArticles.length,
              itemBuilder: (context, index) {
                return ArticleWidget(article: filteredArticles[index]);
              },
            ),
          );
        }
      },
    );
  }
}
