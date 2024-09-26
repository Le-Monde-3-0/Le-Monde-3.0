import './author.dart';
import './topic.dart';
import 'dart:ffi';
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ArticleModel {
  final int id;
  final String title;
  final String? subtitle;
  // final TopicModel topic;
  int? topicId;
  // final AuthorModel author;
  final int authorId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String content;
  final bool draft;
  final int viewCounter;
  int likeCounter;
  // final String content;
  bool owner = false;

  ArticleModel({
    required this.id,
    required this.title,
    this.subtitle,
    // required this.topic,
    this.topicId,
    // required this.author,
    required this.authorId,
    required this.createdAt,
    required this.updatedAt,
    required this.content,
    required this.draft,
    required this.viewCounter,
    required this.likeCounter,
    // required this.content,
  });

  factory ArticleModel.fromJson(Map<String, dynamic> json) {
    return ArticleModel(
      id: json['id'] as int,
      title: json['title'] as String,
      subtitle: json['subtitle'] as String?,
      // topic: json['Topic'] as TopicModel,
      topicId: json['topicId'] as int?,
      // author: json['AuthorName'] as AuthorModel,
      authorId: json['authorId'] as int,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      // cid: json['cid'] as String,
      content: json['content'] as String,
      draft: json['draft'] as bool,
      viewCounter: json['viewCounter'] as int,
      likeCounter: json['likeCounter'] as int,
      // content: json['content'] as String,
    );
  }

  factory ArticleModel.fromMap(Map<String, dynamic> map,  [bool owner = false]) {
    return ArticleModel(
      id: map['id'] as int,
      title: map['title'] as String,
      subtitle: map['subtitle'] as String,
      // topic: map['Topic'] as TopicModel,
      topicId: map['topicId'] as int,
      // author: map['AuthorName'] as AuthorModel,
      authorId: map['authorId'] as int,
      createdAt: DateTime.parse(map['createdAt']),
      updatedAt: DateTime.parse(map['updatedAt']),
      // cid: map['cid'] as String,
      content: map['content'] as String,
      draft: map['draft'] as bool,
      viewCounter: map['viewCounter'] as int,
      likeCounter: map['likeCounter'] as int,
      // content: map['content'] as String,
    ); 
  }
  // Future<bool> owner() async {
  //   final storage = FlutterSecureStorage();
  //   String? userJson = await storage.read(key: 'user');
  //   if (userJson == null) {
  //     return false;
  //   }
  //   Map<String, dynamic> userMap = jsonDecode(userJson);
  //   var myId = userMap['id']; 
  //   return author.id == myId;
  // }
}
