(function() {
    Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll('template');

    Array.prototype.slice.call(templates).forEach(function(tmpl) {
        Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
    });

    Handlebars.partials = Handlebars.templates;


    var ImageModel = Backbone.Model.extend({
        initialize: function(){
            this.fetch()
        },
        url: function() {
            return '/image/' + this.get('imageId')
        }
    })

    var ImageView = Backbone.View.extend({
        el: '#main-container',
        initialize: function() {
            var view = this;
            this.model.on('change', function() {
                view.render();
            })
        },
        render: function() {
            var data = this.model.toJSON()
            var html = Handlebars.templates.image(data);
            this.$el.html(html);

            setTimeout(function(){
                $('#single-image').css("transform", "translateX(0)")
                $('.image-description-container').css("transform", "translateX(0)")
            }, 100)


            var commentsView = new CommentsView({
                model: new CommentsModel({
                    imageId: this.model.get('imageId')
                })
            })
        }
    })

    var ImagesModel = Backbone.Model.extend({
        initialize: function(){
            this.fetch()
        },
        url: function() {
            return '/images'
        }
    })

    var ImagesView = Backbone.View.extend({
        initialize: function() {
            var view = this;
            this.model.on('change', function() {
                view.render();
            })
        },
        render: function() {
            var data = this.model.toJSON()
            var html = Handlebars.templates.images(data);

            this.$el.html(html);
        },
        el: '#main-container'

    })

    var UploadView = Backbone.View.extend({
        events: {
            'submit #upload-form': 'uploadFile'
        },
        uploadFile: function(event) {
            if (event) { event.preventDefault() }

            var values = {};

            _.each(this.$('form').serializeArray(), function(input){
                values[ input.name ] = input.value;
            })

            var file = $('input[type="file"]').get(0).files[0];
            var formData = new FormData();
            formData.append('file', file)
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('username', values.username);

            $.ajax({
                url: '/uploadImage',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function() {
                    router.navigate('/#/', {trigger: true})
                }
            });
        },
        initialize: function() {
            console.log("upload view initialized");
            this.render()
        },
        render: function() {
            var html = Handlebars.templates.upload()
            this.$el.html(html)
        }
    })

    var CommentsModel = Backbone.Model.extend({
        initialize: function(){
            this.fetch()
        },
        url: function(){
            return '/comments/' + this.get('imageId')
        }
    })

    var CommentsView = Backbone.View.extend({
        el: '#comments-section',
        initialize: function(){
            var view = this;
            this.model.on('change', function() {
                view.render();
            })
        },
        render: function(){
            var view = this
            var data = this.model.toJSON()

            _.each(data.comments, function(comment){
                comment.createdAtDate = view.convertDate(comment.created_at)
                comment.createdAtTime = view.convertTime(comment.created_at)
            })

            var html = Handlebars.templates.comments(data);
            this.$el.html(html);
        },

        events: { 'submit form': 'uploadComment' },

        uploadComment: function(event) {
            if (event) { event.preventDefault() }
            var values = {};

            _.each(this.$('#comment-form').serializeArray(), function(input){
                values[ input.name ] = input.value;
            })
            values.imageId = this.model.get('imageId')

            console.log(values);

            var view = this

            $.ajax({
                url: '/uploadComment',
                method: 'POST',
                data: values,
                success: function() {
                    view.model.fetch()
                }
            });
        },

        convertDate: function(isoDate) {
            var date = new Date(isoDate);
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var dt = date.getDate();

            return month + "/" + dt + "/" + year;
        },

        convertTime: function (isoDate){
            var date = new Date(isoDate).toLocaleString();
            var time = date.substring(date.indexOf(",") + 2, date.length)

            return time;
        }
    })


    var Router = Backbone.Router.extend({
        routes: {
            '': 'images',
            'image/:imageId': 'image',
            'upload': 'upload'
        },
        images: function() {
            var imagesView = new ImagesView({
                model: new ImagesModel
            })
        },
        image: function(imageId) {
            var imageView = new ImageView({
                model: new ImageModel({ imageId: imageId })
            })
        },
        upload: function() {
            var uploadView = new UploadView({
                el: '#main-container',
                // model: new UploadModel
            })
        }
    });

    var router = new Router;
    Backbone.history.start();

})();
