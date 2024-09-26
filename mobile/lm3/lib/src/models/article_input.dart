class ArticleInputModel {
  bool draft;
  final int topic;
  final String title;
  final String subtitle;
  final String content;

  ArticleInputModel({
    required this.draft,
    required this.topic,
    required this.title,
    required this.subtitle,
    required this.content,
  });

  Map<String, dynamic> toJson() {
    return {
      'draft': draft,
      'topic': topic,
      'title': title,
      'subtitle': subtitle,
      'content': content,
    };
  }
  factory ArticleInputModel.fromJson(Map<String, dynamic> json, [bool owner = false]) {
    return ArticleInputModel(
      draft: json['Draft'] as bool,
      topic: json['Topic'] as int,
      title: json['Title'] as String,
      subtitle: json['Subtitle'] as String,
      content: json['content'] as String,
    );
  }

}